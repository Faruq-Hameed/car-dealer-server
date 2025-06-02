import { Router } from "express";
import * as userController from "../controllers/users.controller";
import validateObjectId from "../middlewares/ObjectIdValidator";

const userRouter = Router();

userRouter.get("/", userController.getAllUsers);


userRouter.use(validateObjectId)
userRouter.get("/", userController.getAllUsers);

userRouter.get("/:id", userController.getUserById);

export default userRouter;
