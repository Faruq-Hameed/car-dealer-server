import Joi from "joi";

import "dotenv/config";

const envValidation = Joi.object()
  .keys({
    PORT: Joi.number().required().default(3000),
    NODE_ENV: Joi.string()
      .valid("development", "production", "test")
      .required(),

    MONGODB_URI: Joi.string().required(),

    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES: Joi.string().required().default("30m"),
  })
  .unknown();

const { value: envVar, error } = envValidation
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(
    `Cannot Start Server:- Config Validation Error: ${error.message}`
  );
}

export const appConfig = {
  jwt: {
    secret: envVar.JWT_SECRET as string,
    expiresIn: envVar.JWT_EXPIRES as string,
  },
  dBUrl: envVar.MONGODB_URI as string,
  port: envVar.PORT as number,
  serverEnv: envVar.NODE_ENV as string,
};
