import Gig from "../models/gigModel.js";
import notificationModel from "../models/notificationModel.js";
import User from "../models/userModel.js";

export const createGig = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json("No user found!");
    }
    const user = await User.findById(req.user.id);
    const newGig = new Gig({
      userId: req.params.userId,
      ...req.body,
    });

    await notificationModel.create({
      creator: req.params.userId,
      gig: newGig._id,
      content: `${user.username} create a new gig, pending for Approval.`,
      type: "gig-approval",
    });

    const saveGig = await newGig.save();
    res.status(200).json(saveGig);
  } catch (error) {
    console.log("createGigError", error);
    next(error);
  }
};
