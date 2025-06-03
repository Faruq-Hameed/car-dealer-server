import mongoose, { Schema, type Document, type CallbackError } from "mongoose";
import { UserRoles, UserStatusEnum } from "../utils/types/enums";

/** interface for the User document */
interface IUser extends Document {
  email: string;
  phonenumber: string;
  password: string;
  firstname: string;
  lastname: string;
  city: string;
  status: UserStatusEnum; //active or deleted
  role: UserRoles;
  lastTokenGeneration: Date;
  totalCarsPurchased?: number; //for customer
  totalCarsAdded?: number; //for manager i.e seller
  totalCarsSold?: number; //for manager i.e seller
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for the User
const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    phonenumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      lowercase: true,
      required: true,
    },
    lastname: {
      type: String,
      required: true,      
      lowercase: true,
    },

    city: {
      type: String,
      required: true,      
      lowercase: true,
    },
    status: {
      type: String,
      enum: UserStatusEnum,
      default: UserStatusEnum.ACTIVE,
    },
    role: {
      type: String,
      enum: UserRoles,
      default: UserRoles.CUSTOMER,
    },
    lastTokenGeneration: {
      type: Date,
      default: null,
    },
    totalCarsPurchased: {
      type: Number,
      default: 0,
    },
    totalCarsAdded: {
      type: Number,
      default: 0,
    },
    totalCarsSold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//Method to generate a token
const User = mongoose.model<IUser>("users", UserSchema);

export { User, type IUser };
