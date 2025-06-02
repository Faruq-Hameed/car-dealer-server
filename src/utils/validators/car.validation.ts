import Joi from "joi";
import { ICar } from "../../models";

/**Create user data validation */
export const createCarValidator = (data: Partial<ICar>) => {
  const schema = Joi.object({
    category: Joi.string().uuid().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    maker: Joi.string().required(),
    brand: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().required(),
    price: Joi.number().required(),
    mileage: Joi.number().required(),
    color: Joi.string().required(),
    condition: Joi.string().required(),
    fuelType: Joi.string().default("petrol"), //e.g petrol
    transmission: Joi.string().required(),
    seats: Joi.number(),
    doors: Joi.number().required(),
    bodyType: Joi.string().required(),
  });
  return schema.validate(data, { abortEarly: false });
};

/**Update user data validation */
export const updateCarValidator = (data: Partial<ICar>) => {
  const schema = Joi.object({
    category: Joi.string().uuid(),
    name: Joi.string(),
    description: Joi.string(),
    maker: Joi.string(),
    brand: Joi.string(),
    model: Joi.string(),
    year: Joi.number(),
    price: Joi.number(),
    mileage: Joi.number(),
    color: Joi.string(),
    condition: Joi.string(),
    fuelType: Joi.string().default("petrol"), //e.g petrol
    transmission: Joi.string(),
    seats: Joi.number(),
    doors: Joi.number(),
    bodyType: Joi.string(),
  }).min(1);
  return schema.validate(data, { abortEarly: false });
};
