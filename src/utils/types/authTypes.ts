import { UserRoles } from "./enums";

export interface IJwtPayload {
  id: string;
  lastTokenGeneration: Date;
  role: UserRoles;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}
