import Jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
import User from "../models/userModel.js";

export const verifyUser = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(new ErrorHandler(401, "Unauthorized"));

  const decoded = Jwt.verify(token, process.env.JWT);
  req.user = decoded;
  next();
};
