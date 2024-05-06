import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reciver: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    gig: {
      type: mongoose.Types.ObjectId,
      ref: "Gig",
    },
    amount: Number,
    paymentMethod: String,
    content: {
      type: String,
      required: true,
    },
    readStatus: { type: Boolean, default: false },
    type: {
      type: String,
      enum: [
        "gig-approval",
        "gig-approved",
        "payment-approval",
        "payment-approved",
        "order",
        "message",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
