import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import gigRouter from "./routes/gigRoute.js";
import ConverRouter from "./routes/converRoute.js";
import msgRouter from "./routes/msgRouter.js";
dotenv.config();
import cookieParser from "cookie-parser";
import Pusher from "pusher";

const app = express();
app.use(express.json());
app.use(cookieParser());

//pusher
const pusher = new Pusher({
  appId: "1794427",
  key: "3cbe62482136f91d71ee",
  secret: "19c924ca6183264e5b7f",
  cluster: "ap2",
  useTLS: true,
});

// db
mongoose
  .connect(process.env.MONGO_KEY)
  .then(() => {
    console.log("db connected!");
  })
  .catch((error) => {
    console.log("db connect error", error);
  });

const db = mongoose.connection;

db.once("open", () => {
  const message = db.collection("messages");
  const changeStream = message.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const msgDetails = change.fullDocument;
      pusher.trigger("msg", "inserted", msgDetails);
    } else {
      console.log("not found request");
    }
  });
});

// ruters
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/gig", gigRouter);
app.use("/api/conver", ConverRouter);
app.use("/api/msg", msgRouter);

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
