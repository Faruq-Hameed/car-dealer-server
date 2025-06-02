import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import AuthService from "../services/auth.service";
import { generateAuthToken } from "../utils/auth.utils";
import {
  changePasswordValidator,
  createUserValidator,
  loginValidator,
} from "../utils/validators/user.validator";
import { BadRequestException } from "../exceptions";
import { UserRoles } from "../utils/types/enums";
import { ILogin } from "../utils/types/authTypes";

const createUserAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { error } = createUserValidator({...req.body});
    if (error) {
      throw new BadRequestException(error.details[0].message);
    }
    const { password, ...user } = await AuthService.registerAccount(req.body);
    const accessToken = generateAuthToken(
      user.id as string,
      user.role as string,
      user.lastTokenGeneration as Date
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "User added successfully", data: { accessToken, user } });
  } catch (error) {
    next(error);
  }
};

const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { value, error } = loginValidator(req.body);
    console.log({body: req.body, value, error})
    if (error) {
      throw new BadRequestException(error.details[0].message);
    }
    const { password, ...user } = await AuthService.login(value as ILogin);
    const accessToken = generateAuthToken(
      user._id as string,
      user.role as string,
      user.lastTokenGeneration as Date
    );
    return res
      .status(StatusCodes.OK)
      .json({ message: "User login successfully", data: { accessToken, user } });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId, role, lastTokenGeneration } = res.locals;
    const { value, error } = changePasswordValidator(req.body);
    if (error) {
      throw new BadRequestException(error.details[0].message);
    }
    await AuthService.changePassword(value, userId);
    const token = generateAuthToken(
      userId,
      role,
      lastTokenGeneration
    );
    return res
      .status(StatusCodes.OK)
      .json({
        message: "User password changed successfully",
        data: { token },
      });
  } catch (error) {
    next(error);
  }
};


export { createUserAccount, userLogin, changePassword };
