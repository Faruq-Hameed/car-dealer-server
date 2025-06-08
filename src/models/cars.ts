import mongoose, { Schema, type Document, Types } from "mongoose";

// interface for the Car document
interface ICar {
  category: Types.ObjectId;
  description?: string;
  maker: string; //e.g toyota
  brand: string; //new, used
  model: string; //e.g corolla
  year: number;
  price: number;
  images: Array<string>;
  available: boolean;
  addedBy: Types.ObjectId;
  soldTo?: Types.ObjectId;
  soldAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for the Car
const CarSchema: Schema<ICar> = new Schema<ICar>(
  {
    maker: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    brand: {
      type: String,
      enum: ["new", "used"],
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
    images: {
      type: [String],
      default: [],
    },
    available: {
      type: Boolean,
      required: true,
      default: true,
    },
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

    soldTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    soldAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Car = mongoose.model<ICar>("cars", CarSchema);

export { Car, type ICar };
