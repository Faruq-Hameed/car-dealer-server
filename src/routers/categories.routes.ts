import { Router } from "express";
import categoryController from "../controllers/categories.controller";
import Authenticator from "../middlewares/Authenticator";
import validateObjectId from "../middlewares/ObjectIdValidator";
export const categoryRouter = Router();

categoryRouter.use(Authenticator())

categoryRouter.post("/", categoryController.createCategory);

categoryRouter.get("/", categoryController.getAllCategory);

categoryRouter.use(validateObjectId)

categoryRouter.get("/:id", categoryController.getCategoryById);

categoryRouter.put("/:id", categoryController.updateCategory);

categoryRouter.delete("/:id", categoryController.deleteCategory);
