import express from "express";
import { updateUser } from "../controller/userController.js";

const router = express.Router();

router.post("/updateuser/:userId", updateUser);

export default router;
