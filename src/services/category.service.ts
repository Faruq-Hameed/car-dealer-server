import path from "path";
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "../exceptions";
import { Car, Category, ICategory, IUser, User } from "../models";
import { paginate, PaginateOptions, userPopulateFields } from "../utils/common";
import { CategoryStatus, UserRoles } from "../utils/types/enums";
import { PaginationQuery, PaginationResponse } from "../utils/types/common";
import { dateRangeValidator } from "../utils/dateRange";

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

  //   async getTransactions(query: Record<string, any>): Promise<any> {
  //   const {
  //     page = 1,
  //     limit = 10,
  //     name,
  //     type,
  //     parentCategory,
  //     status,
  //     startDate,
  //     endDate,
  //     _id,
  //     ...otherFields
  //   } = query;
  //   const sort: SortOption = { createdAt: -1 };
  //   const options = {
  //     page: parseInt(page as string, 10),
  //     limit: parseInt(limit as string, 10),
  //     sort,
  //     select: '', // remove fields from query
  //   };
  //   const DBquery: Record<string, any> = {
  //     ...otherFields,
  //     ...(name && { name }),
  //     ...(type && { type }),
  //     ...(parentCategory && { parent_category: parentCategory }),
  //     ...(status && { status }),
  //     ...(_id && { _id }),
  //     // both will be passed by dateRangeValidator
  //     createdAt: {
  //       $gte: new Date(startDate as string),
  //       $lte: new Date(endDate as string),
  //     },
  //   };
  //   return await paginate(Transaction, DBquery, options);
  // }

  async fetchAllCategories(
    requestQuery: Record<string, any>
  ): Promise<PaginationResponse<ICategory>> {
    const {
      page = 1, //default page is 1
      sort = "-createdAt",
      limit = 10, //default limit is 10,
      ...query
    } = requestQuery;
    const { startDate, endDate, name } = query;
    const dateRange = dateRangeValidator({ startDate, endDate });
    const dbQuery = {
      ...(name && { name: { $regex: name, $options: "i" } }), //if name is there
      createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
    };
    const options: PaginateOptions = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort: sort as string,
      populate: [{ path: "addedBy", select: userPopulateFields }],
    };
    return await paginate(Category, dbQuery, options);
  }
  //   // let startDate;
  //   // let endDate;
  //   // if (data?.query){
  //   //   ({ startDate, endDate } = data.query);
  //   //   query
  //   //   ({ startDate, endDate } = dateRangeValidator({ startDate, endDate }))
  //   // }
  //   // return await paginate(Category,{...data,
  //   //   populate: [{path: "addedBy", select:userPopulateFields}]
  //   // } )
  //   // const categories = await Category.find({ ...query })
  //   //   .populate([{ path: "addedBy", select: "id firstname lastname" }])
  //   //   .sort(sort)
  //   //   .skip(skip)
  //   //   .limit(limit);
  //   // const total = await Category.countDocuments({ ...query });
  //   // const totalPages = Math.ceil(total / limit);
  //   // return {
  //   //   total,
  //   //   currentPage: page,
  //   //   limit,
  //   //   totalPages,
  //   //   docs: categories,
  //   // };
  // }

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
