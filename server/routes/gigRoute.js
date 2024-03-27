import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
  createGig,
  getGig,
  getSingleGig,
  updateGig,
} from "../controller/gigController.js";

const router = express.Router();

router.post("/creategig/:userId", verifyUser, createGig);
router.get("/getgig/:userId", verifyUser, getGig);
router.put("/updategig/:userId/:gigId", verifyUser, updateGig);
router.get("/getsinglegig/:userId/:gigId", verifyUser, getSingleGig);

export default router;
