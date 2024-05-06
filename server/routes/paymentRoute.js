import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { payment, sendStripeApiKey } from "../controller/paymentController.js";
const router = express.Router();

router.post("/process/:userId", verifyUser, payment);
router.get("/get", sendStripeApiKey);

export default router;
