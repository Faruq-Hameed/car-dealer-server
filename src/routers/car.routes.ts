import { Router } from "express";
import carController from "../controllers/cars.controller";
import Authenticator from "../middlewares/Authenticator";
import validateObjectId from "../middlewares/ObjectIdValidator";
export const carRouter = Router();

carRouter.use(Authenticator())
carRouter.post("/", carController.createCar);

carRouter.get("/", carController.getAllCars);

carRouter.use(validateObjectId)
carRouter.get("/id", carController.getCarById);

carRouter.put("/id", carController.getCarById);

carRouter.delete("/id", carController.getCarById);


