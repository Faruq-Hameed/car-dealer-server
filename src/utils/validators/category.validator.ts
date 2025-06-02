import Joi from "joi";
import { ICategory } from "../../models";

/**Create user data validation */
export const createCategoryValidator = (data: Partial<ICategory>) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });
  return schema.validate(data, { abortEarly: false });
};

/**Update user data validation */
export const updateCategoryValidator = (data: Partial<ICategory>) => {
  const schema = Joi.object({
    description: Joi.string(),
  }).min(1);
  return schema.validate(data, { abortEarly: false });
};
