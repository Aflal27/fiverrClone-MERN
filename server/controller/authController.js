import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (
      (!username,
      !email,
      !password || username === "",
      email === "",
      password === "")
    ) {
      return res.status(400).json({ message: "All frilds are required" });
    }
    const hashPassword = bcryptjs.hashSync(password, 10);
    await User.create({
      username,
      email,
      password: hashPassword,
    });
    res.status(200).json("successfully!");
  } catch (error) {
    next(error);
    console.log("signUp error", error);
  }
};

// sign in
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      return res.status(400).json("All fields required");
    }
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(400).json("User not found");
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(400).json("Invalid password");
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT
    );

    // ignore password
    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    console.log("sign in error", error);
    res.status(500).json("Internal Server error");
  }
};
export const google = async (req, res, next) => {
  try {
    console.log(req.body.email);
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT
      );
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(user);
    } else {
      const genratedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(genratedPassword, 10);
      const newUser = User({
        username:
          req.body.username.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        image: req.body.image,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT
      );

      // can this password cancel
      const { password: pass, ...rest } = newUser._doc;

      res.cookie("access_token", token).status(200).json(rest);
    }
  } catch (error) {
    console.log("google error", error);
    res.status(500).json("Internal Server error");
  }
};
