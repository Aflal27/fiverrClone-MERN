import express from "express";
import {
  createMsg,
  dltMsg,
  getMsg,
  userFriends,
} from "../controller/msgController.js";

const router = express.Router();

router.post("/create", createMsg);
router.get("/getFrd/:userId", userFriends);
router.get("/get/:converId", getMsg);
router.delete("/delete", dltMsg);

export default router;
