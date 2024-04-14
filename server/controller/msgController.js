import Message from "../models/messageModal.js";

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
