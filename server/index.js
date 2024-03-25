import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import gigRouter from "./routes/gigRoute.js";
dotenv.config();
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

// db
mongoose
  .connect(process.env.MONGO_KEY)
  .then(() => {
    console.log("db connected!");
  })
  .catch((error) => {
    console.log("DB ERROR", error);
  });

// ruters
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/gig", gigRouter);

// midelware
// middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error!";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(8000, () => {
  console.log("server is start");
});
