import path from "path";
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "../exceptions";
import { Car, Category, ICategory, IUser, User } from "../models";
import { userPopulateFields } from "../utils/common";
import { CategoryStatus, UserRoles } from "../utils/types/enums";

class CategoryService {
  async addCategory(
    data: Partial<ICategory>,
    managerId: string
  ): Promise<ICategory> {
    const existingCategory = await Category.findOne({ name: data.name });
    if (existingCategory) {
      throw new ConflictException("Category name already exist");
    }
    const category = await Category.create({ ...data, addedBy: managerId });
    return category;
  }

  async fetchAllCategories(): Promise<ICategory[]> {
    const categories = await Category.find().populate([
      { path: "addedBy", select: "id firstname lastname" },
    ]);
    return categories;
  }

  async fetchCategoryById(categoryId: string): Promise<ICategory> {
    const category = await Category.findById(categoryId).populate(
      "addedBy",
      userPopulateFields
    );
    if (!category) {
      throw new NotFoundException("category not found");
    }
    return category;
  }

  async updateCategoryById(
    categoryId: string,
    managerId: string,
    data: Partial<ICategory>
  ): Promise<ICategory> {
    const category = await Category.findById(categoryId, "id");
    if (!category) {
      throw new NotFoundException("category not found to update");
    }
    console.log(category.addedBy);
    if (category.addedBy.toString() !== managerId) {
      throw new ForbiddenException(
        "You are not allowed to update the category"
      );
    }
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, {
      ...data,
    }).populate("addedBy", userPopulateFields);

    if (!updatedCategory) {
      throw new NotFoundException("category not found to update");
    }
    return updatedCategory;
  }

  async deleteCategoryById(
    categoryId: string,
    managerId: string
  ): Promise<string> {
    const [car, category] = await Promise.all([
      Car.findOne({ category: categoryId }, ""), //just want to check if the category is currently in use
      Category.findOne({
        _id: categoryId,
        addedBy: managerId,
        status: CategoryStatus.AVAILABLE,
      }),
    ]);

    if (!category) {
      throw new NotFoundException("Category added by the manager not found");
    }
    let message = "";
    //if the category already has a car, only the status will be updated to delete
    if (car) {
      category.status = CategoryStatus.DELETED;
      await category.save();
      message = "Category status updated to deleted successfully";
    }
    //else delete the category if it has not be used
    else {
      await Category.findByIdAndDelete(categoryId);
      message = "Category deleted successfully";
    }

    return message;
  }
}
export default new CategoryService();
