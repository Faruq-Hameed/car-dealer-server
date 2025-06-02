import { appConfig } from "../config/dev";
import { type ErrorRequestHandler } from 'express';
// ErrorHandler.js
const ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const errStatus: number =
    typeof err.statusCode === 'number' ? err.statusCode : 500;
  const errMsg: string =
    typeof err.message === 'string' ? err.message : 'Something went wrong';

  console.error(err);

  res.status(errStatus).json({
    message: errStatus === 500 ? 'Internal Server Error' : errMsg,
    data: {},
    stack: appConfig.serverEnv === 'development' ? err.stack : {},
  });
};
export default ErrorHandler;
