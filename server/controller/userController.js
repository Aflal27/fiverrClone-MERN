import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

export const updateUser = async (req, res, next) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(403).json("you are not allowed to update this user");
    }
    if (req.body.password?.length < 6) {
      return res.status(400).json("password must be at least 6 characters!");
    }
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    if (req.body.userName?.length < 7 || req.body.userName?.length > 20) {
      return res
        .status(400)
        .json("username must be between 7 and 20 characters!");
    }
    if (req.body.userName?.includes(" ")) {
      return res.status(400).json("username cannot contain spaces");
    }
    if (req.body.userName !== req.body.userName?.toLowerCase()) {
      return res.status(400).json("username must be lowercase");
    }
    if (!req.body.userName?.match(/^[a-zA-Z0-9]+$/)) {
      return res
        .status(400)
        .json("username can only contain letters and numbers");
    }

    const updateuser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          image: req.body.image,
          country: req.body.country,
          phone: req.body.phone,
          description: req.body.description,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateuser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.log("update", error);
    next(error);
  }
};
