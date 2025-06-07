import { Router } from "express";
import categoryController from "../controllers/categories.controller";
import Authenticator from "../middlewares/Authenticator";
import validateObjectId from "../middlewares/ObjectIdValidator";
import { UserRoles } from "../utils/types/enums";
export const categoryRouter = Router();



categoryRouter.get("/", categoryController.getAllCategory);

categoryRouter.use("/:id",validateObjectId)
categoryRouter.get("/:id", categoryController.getCategoryById);

categoryRouter.use(Authenticator(UserRoles.MANAGER))

categoryRouter.post("/", categoryController.createCategory);

categoryRouter.put("/:id", categoryController.updateCategory);

categoryRouter.delete("/:id", categoryController.deleteCategory);
