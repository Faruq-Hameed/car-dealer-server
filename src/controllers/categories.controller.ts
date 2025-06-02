import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import CategoryService from "../services/category.service";
import { ICategory } from "../models";
import { createCategoryValidator, updateCategoryValidator } from "../utils/validators/category.validator";
import { BadRequestException } from "../exceptions";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const managerId = res.locals.userId;
    // For creating a user
    const { error } = createCategoryValidator(req.body);
    if (error) {
      throw new BadRequestException(error.details[0].message);
    }
    const category = await CategoryService.addCategory(
      req.body as Partial<ICategory>,
      managerId
    );
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Category created successfully", data: { category } });
  } catch (err) {
    next(err);
  }
};

const getAllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await CategoryService.fetchAllCategories({...req.body});
    res.status(StatusCodes.OK).json({
      message: "All categories fetched successfully",
      data: { categories },
    });
  } catch (err) {
    next(err);
  }
};

const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await CategoryService.fetchCategoryById(req.params.id);
    res
      .status(StatusCodes.OK)
      .json({ message: "Category fetched successfully", data: { category } });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const managerId = res.locals.userId;
        const { error } = updateCategoryValidator(req.body);
    if (error) {
      throw new BadRequestException(error.details[0].message);
    }

    const category = await CategoryService.updateCategoryById(
      req.params.id,
      managerId,
      req.body
    );
    res
      .status(StatusCodes.OK)
      .json({ message: "Category updated successfully", data: { category } });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const managerId = res.locals.userId;
    const message = await CategoryService.deleteCategoryById(
      req.params.id,
      managerId
    );
    res.status(StatusCodes.OK).send({ message, data: {} });
  } catch (err) {
    next(err);
  }
};

export default {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
