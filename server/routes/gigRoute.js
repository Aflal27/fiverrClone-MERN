import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { createGig } from "../controller/gigController.js";

const router = express.Router();

router.post("/creategig/:userId", verifyUser, createGig);

export default router;
