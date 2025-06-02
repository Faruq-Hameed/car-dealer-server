// import { appConfig}
// import { User
// import {
//   ForbiddenException,
//   NoTokenException,
//   TokenException,
// } from '@/exceptions';
// import type { NextFunction, Request, Response } from 'express';
// import jwt, { type JwtPayload, type Secret } from 'jsonwebtoken';
// import { type UserPayload } from '@/utils/types/payload';
// import dayjs from 'dayjs';

// // tokens
// import { v4 as uuidv4 } from 'uuid';

// const Authenticator = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<any> => {
//   try {
//     const bearerHeader = req.headers.authorization;
//     const token = bearerHeader?.split(' ')[1];
//     if (!token) {
//       next(new NoTokenException('Invalid or Expired Token'));
//       return;
//     }

//     const decoded = jwt.verify(
//       token,
//       config.jwt.privateKey as Secret,
//     ) as JwtPayload;

//     if (!decoded?.id) {
//       next(new NoTokenException('Invalid Token. Please Login'));
//       return;
//     }

//     // check if temp token is used in a wrong route
//     const { method, url } = req;
//     const isPasswordRoute = url.endsWith('/password');

//     // reject temp token if used for normal authenticated endpoints
//     if (decoded.is_temp && method !== 'POST' && !isPasswordRoute) {
//       next(new ForbiddenException('Temporary tokens not allowed!'));
//       return;
//     }

//     const user = await User.findByPk(decoded.id as string, {
//       attributes: [
//         'id',
//         'is_deleted',
//         'session_id',
//         'last_login',
//         'user_status',
//       ],
//     });
//     if (!user) {
//       next(new TokenException('Invalid Token. Please Login'));
//       return;
//     }

//     const decodedLastLogin = decoded.last_login
//       ? new Date(decoded.last_login as string)
//       : null;
//     const userLastLogin = user.last_login ? new Date(user.last_login) : null;

//     const invalidSession =
//       decodedLastLogin && userLastLogin
//         ? dayjs(decodedLastLogin).isBefore(userLastLogin)
//         : false;

//     if (invalidSession) {
//       next(new TokenException('Invalid session, please log in again'));
//       return;
//     }
//     // check user status on the go.
//     if (user.user_status === 'blocked') {
//       next(
//         new TokenException(
//           'Your account has been blocked, please reach out to our support.',
//         ),
//       );
//       return;
//     }

//     if (decoded.is_deleted) {
//       next(
//         new TokenException(
//           'Your account has been disabled, please reach out to our support.',
//         ),
//       );
//       return;
//     }

//     req.user = user as unknown as UserPayload;
//     next();
//   } catch (error) {
//     next(new TokenException('Authentication failed, please try again'));
//   }
// };

// const sessionManager = async (
//   user: any,
//   deviceId?: string,
//   isTemp: boolean = false,
// ): Promise<any> => {
//   const timing = Date.now(); // this will be used for both last login on user row and token
//   const sessionId = uuidv4();
//   await User.update(
//     { sessionId, last_login: timing, last_refresh: timing },
//     { where: { id: user.id } },
//   );
//   const accessToken = await generateAuthToken(user, timing, isTemp);
//   if (isTemp) {
//     // no need for refresh token if it's just a temp token
//     return accessToken;
//   }
//   const newRefreshToken = await generateRefreshToken(user, timing, deviceId);

//   return {
//     accessToken,
//     newRefreshToken,
//   };
// };

// const generateAuthToken = async (
//   user: any,
//   generatedAt: number,
//   isTemp: boolean,
// ): Promise<string> => {
//   const expiresIn = config.jwt.accessTokenExpiry;
//   return jwt.sign(
//     {
//       id: user.id,
//       is_deleted: user.is_deleted,
//       session_id: user.session_id,
//       last_login: generatedAt, // to ensure it is the same time with that of db
//       user_status: user.user_status,
//       expires_in: expiresIn,
//       is_temp: isTemp, // is temporary token. Has limited usage
//     },
//     `${config.jwt.privateKey}`,
//     { expiresIn },
//   );
// };

// const generateRefreshToken = async (
//   user: any,
//   lastRefresh: any,
//   deviceId?: string,
// ): Promise<string> => {
//   return jwt.sign(
//     {
//       id: user.id,
//       last_login: lastRefresh, // date last one was generated
//       deviceId, // to uniquely identify the device during biometric auth
//     },
//     `${config.jwt.refreshTokenKey}`,
//     { expiresIn: config.jwt.refreshTokenExpiry },
//   );
// };

// export { Authenticator, sessionManager };
