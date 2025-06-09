import { not } from "joi";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "../exceptions";
import { ICar, Car, User, Category } from "../models";
import { UserRoles } from "../utils/types/enums";
import mongoose, { Types } from "mongoose";
import { PaginationQuery, PaginationResponse } from "../utils/types/common";
import { paginate, PaginateOptions } from "../utils/common";
import { dateRangeValidator } from "../utils/dateRange";

class CarService {
  /** service to add a new car by manager */
  async addNewCar(data: Partial<ICar>, managerId: string): Promise<ICar> {
    //check if both category and manager are valid(manager also check for role)
    const categoryId = data.category;
    const [category, manager] = await Promise.all([
      Category.findById(categoryId, ""),
      User.findOne({ _id: managerId, role: UserRoles.MANAGER }, "role"),
    ]);
    if (!category) {
      throw new BadRequestException("Invalid category provided");
    }
    if (!manager) {
      throw new NotFoundException("Manager not found or user is not a manager");
    }

    // start a transaction the process has to be ACID compliant
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      //Should have ran the opration below parrallell but the mongoose session fails if done that way
      const [createdCar] = await Car.create([{ ...data, addedBy: managerId }], {
        session,
      });

      await Category.findByIdAndUpdate(
        categoryId,
        { $inc: { totalCars: 1 } },
        { new: true, session }
      );

      await User.findByIdAndUpdate(
        managerId,
        { $inc: { totalCarsAdded: 1 } },
        { new: true, session }
      );

      await session.commitTransaction();

      return createdCar;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**service to fetch all cars */
  async fetchAllCars(
    requestQuery?: Record<string, any>
  ): Promise<PaginationResponse<ICar>> {
    const {
      page = 1,
      limit = 10, //default limit is 10
      sort,
      category,
      maker,
      model,
      startPrice,
      endPrice,
      startDate,
      endDate,
      ...others /// allows for flexible filtering on extra fields
    } = requestQuery || {};
    const skip = (page as number) && (limit as number) ? (page - 1) * limit : 0;
    const dateRange = dateRangeValidator({ startDate, endDate }); //normalized the date range

    const dbQuery = {
      ...others, /// allows for flexible filtering on extra fields

      // Match 'maker' using case-insensitive partial match
      ...(maker && { maker: { $regex: maker, $options: "i" } }),

      // Match 'model' similarly
      ...(model && { model: { $regex: model, $options: "i" } }),

      // Add price filter if either startPrice or endPrice is provided
      ...(startPrice || endPrice
        ? {
            price: {
              ...(startPrice && { $gte: parseInt(startPrice as string) }),
              ...(endPrice && { $lte: parseInt(endPrice as string) }),
            },
          }
        : {}),
      updatedAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }, //this can also when purchased too
    };
    const cars = await Car.find(dbQuery)
      .populate([
        { path: "addedBy", select: "id firstname lastname" },
        { path: "soldTo", select: "id firstname lastname" },
        { path: "category", select: "name" },
      ])
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const totalDocs = await Car.countDocuments(dbQuery);
    const totalPages = Math.ceil(totalDocs / limit);
    return {
      totalDocs,
      currentPage: page,
      limit,
      totalPages,
      docs: cars || [],
    };
  }

  /** service to fetch a car by id */
  async fetchCarById(carId: string): Promise<ICar> {
    const populateOptions = [
      { path: "addedBy", select: "id firstname lastname" },
      { path: "soldTo", select: "id firstname lastname" },
      { path: "category", select: "name" },
    ];
    const car = await Car.findById(carId).populate(populateOptions);
    if (!car) {
      throw new NotFoundException("Car not found");
    }
    return car;
  }

  /** service to update a car by manager that added it*/
  async updateCar(
    carId: string,
    data: Partial<ICar>,
    managerId: string
  ): Promise<ICar> {
    const [car, manager] = await Promise.all([
      Car.findById(carId).select("addedBy available"),
      User.findById(managerId).select("totalCarsAdded"),
    ]);
    if (!car || !manager) {
      throw new NotFoundException("Car or manager not found");
    }
    //ensure that only available car is updated by right manager
    if (!car.available || car.addedBy.toString() !== managerId) {
      throw new ForbiddenException("You are not allowed to update this car");
    }
    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      { ...data },
      { new: true }
    );
    return updatedCar as ICar;
  }

  /** service to delete a car by manager that added it*/
  async deleteCar(carId: string, managerId: string): Promise<void> {
    const [car, manager] = await Promise.all([
      Car.findById(carId).select("addedBy available category"),
      User.findById(managerId).select("totalCarsAdded"),
    ]);
    if (!car || !manager) {
      throw new NotFoundException("Car or manager not found");
    }
    if (!car.available || car.addedBy.toString() !== managerId) {
      throw new ForbiddenException("You are not allowed to delete this car");
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await Promise.all([
        Car.deleteOne({ _id: carId }, { session }),
        User.findByIdAndUpdate(
          managerId,
          { $inc: { totalCarsAdded: -1 } },
          { session }
        ),
        Category.findByIdAndUpdate(
          car.category,
          { $inc: { totalCars: -1 } },
          { new: true, session }
        ),
      ]);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /** service to buy a car by customer */
  async buyACar(carId: string, customerId: string): Promise<ICar> {
    const [car, customer] = await Promise.all([
      Car.findById(carId).select("addedBy available soldTo"),
      User.findById(customerId).select("totalCarsAdded"),
    ]);
    if (!car || !customer) {
      throw new NotFoundException("Car or customer not found");
    }
    if (!car.available) {
      throw new ForbiddenException("Car not available for sale"); //i.e car has been sold
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      //update car and user collections to reflect the purchase
      await Promise.all([
        Car.findOneAndUpdate(
          { _id: carId, available: true, soldTo: null }, //ensure the car is available and not already sold
          { available: false, soldAt: new Date(), soldTo: customerId },
          { session, new: true }
        ),
        User.findByIdAndUpdate(
          customerId,
          { $inc: { totalCarsPurchased: 1 } }, //increment the total cars purchased by the customer
          { session }
        ),
      ]);
      await session.commitTransaction();
      const updatedCar = await Car.findById(carId).populate([
        //this was not done in the above query to avoid circular reference
        { path: "addedBy", select: "id firstname lastname" },
        { path: "soldTo", select: "id firstname lastname" },
        { path: "category", select: "name" },
      ]);
      if (!updatedCar) {
        throw new BadRequestException("Car not found or not available");
      }
      return updatedCar;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}

export default new CarService();
