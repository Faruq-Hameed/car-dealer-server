import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { BadRequestException } from "../exceptions";

const validateObjectId = (req: Request, _res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return next(new BadRequestException("Missing id parameter"));
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new BadRequestException("Invalid id format"));
  }
  next();
};

export default validateObjectId;