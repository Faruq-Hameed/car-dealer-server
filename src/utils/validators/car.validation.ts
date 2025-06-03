import Joi from "joi";
import { ICar } from "../../models";

/**Create user data validation */
export const createCarValidator = (data: Partial<ICar>) => {
  const schema = Joi.object({
    category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    description: Joi.string().required(),
    maker: Joi.string().required(),
    brand: Joi.string().required().valid("new", "used"),
    model: Joi.string().required(),
    year: Joi.number().required(),
    price: Joi.number().required(),

  });
  return schema.validate(data, { abortEarly: false });
};

/**Update user data validation */
export const updateCarValidator = (data: Partial<ICar>) => {
  const schema = Joi.object({
    category: Joi.string().uuid(),
    description: Joi.string(),
    maker: Joi.string(),
    brand: Joi.string(),
    model: Joi.string(),
    year: Joi.number(),
    price: Joi.number(),

  }).min(1);
  return schema.validate(data, { abortEarly: false });
};
