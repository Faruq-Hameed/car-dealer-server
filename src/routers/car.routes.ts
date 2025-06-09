import { Router } from "express";
import carController from "../controllers/cars.controller";
import Authenticator from "../middlewares/Authenticator";
import validateObjectId from "../middlewares/ObjectIdValidator";
import { UserRoles } from "../utils/types/enums";
export const carRouter = Router();

carRouter.use(validateObjectId)

carRouter.get("/", carController.getAllCars);
carRouter.get("/me", [Authenticator(), carController.getAUserCars]);  //get my cars

carRouter.get("/:id", carController.getCarById);

carRouter.put("/buy/:id", [Authenticator(UserRoles.CUSTOMER), carController.purchaseCarByCustomer]);


carRouter.use(Authenticator(UserRoles.MANAGER))
carRouter.post("/", carController.createCar);


carRouter.put("/:id", carController.updateCar);

carRouter.delete("/:id", carController.deleteCar);


