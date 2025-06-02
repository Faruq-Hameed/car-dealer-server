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


app.get("/", (req, res) => {
  res.send("Car Dealership API is running 🚗");
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

/** Invalid api route handler*/
// app.use('*', (req: Request, res: Response) => {
//   return res.status(404).send({ message: 'Page not found!', data: null });
// });