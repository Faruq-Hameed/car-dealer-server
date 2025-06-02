import mongoose, { Schema, type Document, Types } from "mongoose";

// interface for the Car document
interface ICar {
  category: Types.ObjectId;
  description?: string;
  addedBy: Types.ObjectId;
  maker: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  condition: string; //e.g new
  fuelType: string;
  images: Array<string>;
  available: boolean;
  soldTo?: string;
  soldAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for the Car
const CarSchema: Schema<ICar> = new Schema<ICar>({
    category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "categories",
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  available: {
    type: Boolean,
    required: true,
    default: true,
  },
  soldTo: {
    type: String,
    default: null,
  },
  soldAt: {
    type: Date,
    default: null,
  },
  maker: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
    fuelType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const Car = mongoose.model<ICar>("cars", CarSchema);

export { Car, type ICar };
