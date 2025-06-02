import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { appConfig } from "../config/dev";
import { IJwtPayload } from "./types/authTypes";
import { TokenException } from "../exceptions/TokenException";

export const payload: string = "_id isAdmin isDeleted adminRole sessionId";
export const adminPayload: string = "_id is_active job_title"; // subject to change

export const userPublicFields =
  "email username phone firstname lastname _id lastTokenGeneration status role";

export const generateAuthToken = (
  userId: string,
  role: string,
  lastTokenGeneration: Date
): string => {
  return jwt.sign(
    {
      id: userId,
      lastTokenGeneration,
      role,
    },
    appConfig.jwt.secret,
    { expiresIn: "30m"}
  );
};

export const verifyAuthToken = (
  token: string,
): IJwtPayload => {
  const decoded = jwt.verify(token, appConfig.jwt.secret);
  console.log({decoded})
  if (!decoded) throw new TokenException();
  return decoded as IJwtPayload;
};

/** Middleware to hash password before saving*/ 
export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

/**  Method to compare passwords*/
export const comparePassword = async function (
  candidatePassword: string,
  dbPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, dbPassword);
};