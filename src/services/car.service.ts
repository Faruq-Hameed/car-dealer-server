import { not } from "joi";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "../exceptions";
import { ICar, Car, User, Category } from "../models";
import { UserRoles } from "../utils/types/enums";
import mongoose, { Types } from "mongoose";

class CarService {
  /** service to add a new car by manager */
  async addNewCar(data: Partial<ICar>, managerId: string): Promise<ICar> {
    //check if both category and manager are valid(manager also check for role)
    const categoryId = data.category as Types.ObjectId;
    const [category, manager] = await Promise.all([
      Category.findById(categoryId, ""),
      User.findOne({ id: managerId, role: UserRoles.MANAGER }, "role"),
    ]);
    if (!category) {
      throw new BadRequestException("Invalid category provided");
    }
    if (!manager) {
      throw new NotFoundException("Manager not found or user is not a manager");
    }

    // start a transaction the process has to be ACID compliant
    const session = await mongoose.connection.startSession();
    session.startTransaction();
    try {
      const [newCar] = await Promise.all([
        Car.create({ ...data, addedBy: managerId }, { session }),
        Category.findByIdAndUpdate(
          categoryId,
          { $inc: { totalCars: 1 } },
          { new: true, session }
        ).select("name totalCars"),
        User.findByIdAndUpdate(
          //already confirmed up to be a manager so no need to check role
          managerId,
          { $inc: { totalCarsAdded: 1 } },
          { new: true, session }
        ),
      ]);
      await session.commitTransaction();

      // Populate the returned car with updated category and manager info
      const populatedCar = await Car.findById(newCar[0].id).populate([
        { path: "addedBy", select: "id firstname lastname" },
        { path: "category", select: "id name totalCars" },
      ]);
      return populatedCar as ICar;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**service to fetch all categories */

  /**service to fetch all cars */
  async fetchAllCars(): Promise<ICar[]> {
    const cars = await Car.find().populate([
      { path: "addedBy", select: "id firstname lastname" },
      { path: "category", select: "id name" },
    ]);
    return cars;
  }

  /** service to fetch a car by id */
  async fetchCarById(carId: string): Promise<ICar> {
    const populateOptions = [
      { path: "addedBy", select: "id firstname lastname" },
      { path: "category", select: "id name" },
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
      Car.findById(carId).select("addedBy"),
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
      Car.findById(carId).select("addedBy"),
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
}

export default new CarService();
