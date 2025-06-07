import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { BadRequestException } from "../exceptions";

const validateObjectId = (req: Request, _res: Response, next: NextFunction) => {
  console.log("req.params:", req.params);
  const id = req.params.id;
  if (!id) {
    return next();
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestException("Invalid id format");
  }
  next();
};

export default validateObjectId;