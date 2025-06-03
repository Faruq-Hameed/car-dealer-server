import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import carService from "../services/car.service";
import { ICar } from "../models";
import { BadRequestException } from "../exceptions";
import { createCarValidator, updateCarValidator } from "../utils/validators/car.validation";

const createCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
       const { error } = createCarValidator(req.body);
        if (error) {
          throw new BadRequestException(error.details[0].message);
        }
    const managerId = res.locals.userId;
    const car = await carService.addNewCar(
      req.body as Partial<ICar>,
      managerId
    );
    res
      .status(StatusCodes.CREATED)
      .json({ message: "New car added successfully", data: { car } });
  } catch (err) {
    next(err);
  }
};

const getAllCars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cars = await carService.fetchAllCars(req.query);
    res
      .status(StatusCodes.OK)
      .json({ message: "All cars fetched successfully", data: { cars } });
  } catch (err) {
    next(err);
  }
};

const getCarById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const car = await carService.fetchCarById(req.params.id);
    res
      .status(StatusCodes.OK)
      .json({ message: "Car fetched successfully", data: { car } });
  } catch (err) {
    next(err);
  }
};

const updateCar = async (req: Request, res: Response, next: NextFunction) => {
         const { error } = updateCarValidator(req.body);
        if (error) {
          throw new BadRequestException(error.details[0].message);
        }
  try {
    const managerId = res.locals.userId;

    const car = await carService.updateCar(req.params.id, req.body, managerId);
    res
      .status(StatusCodes.OK)
      .json({ message: "car updated successfully", data: { car } });
  } catch (err) {
    next(err);
  }
};

const deleteCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const managerId = res.locals.userId;
    await carService.deleteCar(req.params.id, managerId);
    res
      .status(StatusCodes.OK)
      .json({ message: "car deleted successfully", data: {} });
  } catch (err) {
    next(err);
  }
};

export default {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
};
