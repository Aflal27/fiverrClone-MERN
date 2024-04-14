import Converstion from "../models/coversiton.js";
import User from "../models/userModel.js";

export const createConverstion = async (req, res, next) => {
  try {
    const { senderId, reciverId } = req.body;
    const exite = await Converstion.findOne({
      member: { $all: [senderId, reciverId] },
    });

    if (exite) {
      res.status(200).json("alredy exite");
      return;
    }
    const conver = await Converstion.create({ member: [senderId, reciverId] });
    await User.findByIdAndUpdate(senderId, {
      $push: { friends: reciverId },
    });
    await User.findByIdAndUpdate(reciverId, {
      $push: { friends: senderId },
    });
    res.status(201).json({
      message: "success",
      conver,
    });
  } catch (error) {
    next(error);
  }
};

export const getConverstion = async (req, res, next) => {
  try {
    const { senderId, reciverId } = req.params;

    const data = await Converstion.findOne({
      member: { $all: [senderId, reciverId] },
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
