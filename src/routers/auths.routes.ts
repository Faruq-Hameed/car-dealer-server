import { Router } from "express";
import * as authController from "../controllers/auths.controller";
import Authenticator from "../middlewares/Authenticator";

const authRouters = Router();

authRouters.post("", authController.createUserAccount);
authRouters.post("/login", authController.userLogin);

authRouters.use(Authenticator())
authRouters.put("/password", authController.changePassword);

export default authRouters;
