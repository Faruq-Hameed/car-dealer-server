import CustomException from "./CustomException";
import { StatusCodes } from "http-status-codes";

export class UnauthorizedException extends CustomException {
  statusCode = StatusCodes.UNAUTHORIZED;

  constructor(message = "Unauthorized request") {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }

  serialize(): any {
    return {
      statusCode: this.statusCode,
      status: "error",
      message: this.message,
    };
  }
}
