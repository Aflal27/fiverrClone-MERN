import express from "express";
import {
  deleteUser,
  signOutUser,
  updateUser,
} from "../controller/userController.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/updateuser/:userId", verifyUser, updateUser);
router.delete("/deleteuser/:userId", verifyUser, deleteUser);
router.post("/signout", signOutUser);

export default router;
