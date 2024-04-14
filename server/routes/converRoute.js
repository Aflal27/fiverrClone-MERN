import express from "express";
import {
  createConverstion,
  getConverstion,
} from "../controller/converstion.js";

const router = express.Router();

router.post("/create", createConverstion);
router.get("/get/:senderId/:reciverId", getConverstion);

export default router;
