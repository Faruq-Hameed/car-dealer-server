import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { BadRequestException } from "../exceptions";

const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    // return next(new BadRequestException("Invalid id format"));
  }
  
  next();
};

export default validateObjectId;