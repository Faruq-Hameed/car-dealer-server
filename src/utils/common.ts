import { Document, Model } from "mongoose";

import { SortOrder } from "mongoose";


export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string | { [key: string]: SortOrder | { $meta: any } } | [string, SortOrder][] | null | undefined;
  query?: any;
  populate?: any;
}

export interface PaginationResponse<T> {
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
  docs: T[];
}

export async function paginate<T extends Document>(
  model: Model<T>,
  options: PaginationQuery = {}
): Promise<PaginationResponse<T>> {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt", //default sort by createdAt
    query = {},
    populate,
  } = options;

  const skip = (page - 1) * limit;

  let docsQuery = model.find(query).sort(sort).skip(skip).limit(limit);

  if (populate) {
    docsQuery = docsQuery.populate(populate);
  }

  const [docs, total] = await Promise.all([
    docsQuery,
    model.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    total,
    currentPage: page,
    limit,
    totalPages,
    docs,
  };
}

export const userPopulateFields = "firstname lastname email phonenumber role"