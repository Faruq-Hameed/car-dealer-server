//car category model

import mongoose, { Document, Schema, Types } from "mongoose";
import { CategoryStatus } from "../utils/types/enums";

interface ICategory extends Document {
  name: string;
  description: string;
  addedBy: Types.ObjectId;
  status: CategoryStatus; //i.e available or deleted
  totalCars: number; //total car that belong to this category
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      default: CategoryStatus.AVAILABLE,
    },
    totalCars: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>("categories", CategorySchema);

export { Category, type ICategory };
