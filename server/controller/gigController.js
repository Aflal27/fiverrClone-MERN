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

// get gig
export const getGig = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json("No user found!");
    }
    const gigs = await Gig.find({ userId: req.params.userId });
    res.status(200).json(gigs);
  } catch (error) {
    console.log("getSingleGigError", error);
    next(error);
  }
};

// update gig
export const updateGig = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json("No user found!");
    }
    const user = await User.findById(req.user.id);

    const updateGig = await Gig.findByIdAndUpdate(
      req.params.gigId,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );

    await notificationModel.create({
      creator: req.params.userId,
      gig: updateGig._id,
      content: `${user.username} update a  gig, pending for Approval.`,
      type: "gig-approval",
    });

    res.status(200).json(updateGig);
  } catch (error) {
    console.log("updateGigError", error);
    next(error);
  }
};

//get single gig
export const getSingleGig = async (req, res, next) => {
  try {
    // if (req.user.id !== req.params.userId) {
    //   return res.status(403).json("No user found!");
    // }

    const gig = await Gig.findById(req.params.gigId).populate(
      "userId",
      "username country description skills level image"
    );
    res.status(200).json(gig);
  } catch (error) {
    console.log("getSingleGigError", error);
    next(error);
  }
};

//delete gig
export const dltGig = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json("No user found!");
    }
    await Gig.findByIdAndDelete(req.params.gigId);
    res.status(200).json("deleted successfully!");
  } catch (error) {
    console.log("DltGigError", error);
    next(error);
  }
};
