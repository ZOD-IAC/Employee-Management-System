import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./features/auth/auth.routes.js";
import { bootStrap } from "./config/seedData.js";

dotenv.config();
const app = express();
bootStrap();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

app.use("/api/auth", authRoutes);

export default app;
