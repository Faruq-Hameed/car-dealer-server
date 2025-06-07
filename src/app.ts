import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv, { config } from "dotenv";
import mongoose from "mongoose";

import { appConfig } from "./config/dev";
import ErrorHandler from "./utils/errorHandlers";
import authRouters from "./routers/auths.routes";
import userRouters from "./routers/users.routes";
import { categoryRouter } from "./routers/categories.routes";
import { carRouter } from "./routers/car.routes";

//loading my env variables
dotenv.config();
const app = express();
const PORT = appConfig.port || 5000;
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Car Dealership API is running 🚗");
});


//This is added to handle error in case of no body is passed in the request. I was unable to find out why it was not working
//I have added this middleware to handle error in case of no body is passed in the request
app.use("/", (req, res, next) => {
  if(!req.body) req.body = {}
  next()
});
app.use('/api/v1/auths', authRouters)
app.use('/api/v1/users', userRouters)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/cars', carRouter)

// Connect DB and start server
mongoose
  .connect(appConfig.dBUrl).then(()=>{
    console.log('Db connected successfully')
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });

  
// error handler
app.use(ErrorHandler);

//Handle all other routes that are not defined in the routes above Invalid api route
app.use((req: Request, res: Response) => {
   res.status(404).send({
    message: '🚨 Page not found! 🚨',
    data: null,
  });
});
