import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    image: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/3607/3607444.png",
    },
    country: {
      type: String,
    },
    phone: {
      type: String,
    },
    description: {
      type: String,
    },
    skills: {
      type: Array,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      default: 0,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    beingCleared: [
      {
        order: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
        amount: { type: Number, required: true },
        clearAt: {
          type: Date,
          default: () => Date.now() + 14 * 24 * 60 * 60 * 1000,
        },
      },
    ],
    level: {
      type: String,
      enum: ["New Seller", "Level 1", "Level 2", "Top Rated"],
      default: "New Seller",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
