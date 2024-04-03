import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
  createGig,
  dltGig,
  getGig,
  getSingleGig,
  updateGig,
} from "../controller/gigController.js";

const router = express.Router();

router.post("/creategig/:userId", verifyUser, createGig);
router.get("/getgig/:userId", verifyUser, getGig);
router.put("/updategig/:userId/:gigId", verifyUser, updateGig);
router.get("/getsinglegig/:gigId", getSingleGig);
router.delete("/deletegig/:userId/:gigId", verifyUser, dltGig);

export default router;
