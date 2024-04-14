import express from "express";
import { createMsg } from "../controller/msgController.js";

const router = express.Router();

router.post("/create", createMsg);

export default router;
