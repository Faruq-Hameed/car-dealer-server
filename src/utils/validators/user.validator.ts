import Joi from "joi";
import { UserRoles } from "../types/enums";
import { IUser } from "../../models";

/**Create user data validation */
export const createUserValidator = (data: Partial<IUser>) => {
  const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    phonenumber: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required(),
    password: Joi.string().min(8).required(),
    firstname: Joi.string().min(2).max(50).required(),
    lastname: Joi.string().min(2).max(50).required(),
    city: Joi.string().min(2).max(100).required(),
    role: Joi.string()
      .valid(...Object.values(UserRoles))
      .required(),
  });
  return createUserSchema.validate(data, { abortEarly: false });
};

/**Validate the user data to update */
export const updateUserValidator = (data: Partial<IUser>) => {
  const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    phonenumber: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .optional(),
    password: Joi.string().min(8).optional(),
    firstname: Joi.string().min(2).max(50).optional(),
    lastname: Joi.string().min(2).max(50).optional(),
    city: Joi.string().min(2).max(100).optional(),
  }).min(1);
  return updateUserSchema.validate(data, { abortEarly: false });
};

export const loginValidator = (data: any): Joi.ValidationResult => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });
  return loginSchema.validate(data);
};

export const changePasswordValidator = (data: { email: string; password: string }) => {
  const Schema = Joi.object({
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
  });
  return Schema.validate(data, { abortEarly: false });
};
/** validator to change password */
// export const passwordValidator = (data: unknown): Joi.ValidationResult => {
//   const customerStatusSchema = Joi.object({
//     oldPassword: Joi.string().min(8).required(),
//     newPassword: Joi.string().min(8).required(),
//   });
//   return customerStatusSchema.validate(data, {
//     abortEarly: false, // Include all errors
//     errors: { wrap: { label: '' } },
//   });
// };