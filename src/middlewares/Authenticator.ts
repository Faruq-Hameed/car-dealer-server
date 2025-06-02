import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exceptions/UnauthorizedException";
import { verifyAuthToken } from "../utils/auth.utils";
import { UserRoles, UserStatusEnum } from "../utils/types/enums";
import { BadRequestException, NotFoundException, NoTokenException, TokenException } from "../exceptions";
import { User } from "../models";

/**User authenticator middleware, also check for role if provided */
const Authenticator = (role?: UserRoles) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new NoTokenException();
      }

      const token = authHeader.split(" ")[1];
      
      const payload = verifyAuthToken(token); // implement this to verify and decode JWT
      // Role check
      if (role && role !== payload.role) {
        return next(new UnauthorizedException());
      }
      const user = await User.findById(payload.id, 'lastTokenGeneration status')
      console.log({payload})
      if(!user || user.status === UserStatusEnum.DELETED ){
        throw new NotFoundException('User account is no longer valid ')
      }
      // const lastDbTokeGeneration =  user.lastTokenGeneration || null
      // const payloadTokenGeneration =  payload.lastTokenGeneration || null
      // const isSessionValid = lastDbTokeGeneration < payloadTokenGeneration
      // console.log({lastDbTokeGeneration, payloadTokenGeneration, isSessionValid})
      // if(!isSessionValid){
      //   throw new TokenException('Invalid session')
      // }
      // const isSessionExpired = (user.lastTokenGeneration && payload.lastTokenGeneration)?
      // (user.lastTokenGeneration < payload.lastTokenGeneration) ? false : true

      // Attach user info to res.locals for downstream use
      res.locals.role = payload.role;
      res.locals.userId = payload.id;
      res.locals.lastTokenGeneration = payload.lastTokenGeneration;

      return next();
    } catch (error) {
    next(new TokenException('Authentication failed, please try again'));
    }
  };
};

export default Authenticator;
