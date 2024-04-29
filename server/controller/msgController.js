import Message from "../models/messageModal.js";
import User from "../models/userModel.js";

export const createMsg = async (req, res, next) => {
  try {
    const newMsg = Message({
      ...req.body,
    });
    await newMsg.save();
    res.status(200).json("msgCreateSuccessfully!");
  } catch (error) {
    console.log("createMsg", error);
    next(error);
  }
};

export const userFriends = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate(
      "friends",
      "username image email "
    );
    const userFrd = user.friends;
    res.status(200).json(userFrd);
  } catch (error) {
    next(error);
    console.log("userFrd", error);
  }
};

export const getMsg = async (req, res, next) => {
  try {
    const msg = await Message.find({ converstionID: req.params.converId });
    res.status(200).json(msg);
  } catch (error) {
    next(error);
    console.log("getMsg", error);
  }
};

export const dltMsg = async (req, res, next) => {
  try {
    await Message.findByIdAndDelete(req.body.dltId);
    res.status(200).json("msg has been deleted!");
  } catch (error) {
    console.log("dltMsg", error);
    next(error);
  }
};
