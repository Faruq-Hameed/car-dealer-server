import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const users = await UserService.findAllUsers();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Users fetched successfully", data: { users } });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user = await UserService.findUserById(req.params.id);
    return res
      .status(StatusCodes.OK)
      .json({ message: "User fetched successfully", data: { user } });
  } catch (error) {
    next(error);
  }
};

export {getAllUsers, getUserById}