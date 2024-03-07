import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// db
mongoose
  .connect(process.env.MONGO_KEY)
  .then(() => {
    console.log("db connected!");
  })
  .catch((error) => {
    console.log("DB ERROR", error);
  });

app.listen(8000, () => {
  console.log("server is start");
});
