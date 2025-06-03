import { Router } from "express";
import carController from "../controllers/cars.controller";
import Authenticator from "../middlewares/Authenticator";
import validateObjectId from "../middlewares/ObjectIdValidator";
import { UserRoles } from "../utils/types/enums";
export const carRouter = Router();

carRouter.get("/", carController.getAllCars);
carRouter.get("/:id", carController.getCarById);

carRouter.put("/:id", [Authenticator(UserRoles.CUSTOMER), carController.purchaseCarByCustomer]);

carRouter.get("/me", [Authenticator(), carController.getAUserCars]);  //get my cars

carRouter.use(Authenticator(UserRoles.MANAGER))
carRouter.post("/", carController.createCar);

carRouter.use(validateObjectId)

carRouter.put("/:id", carController.getCarById);

carRouter.delete("/:id", carController.deleteCar);


