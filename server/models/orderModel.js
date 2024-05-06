import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  img: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
  buyerId: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});
const Order = mongoose.model("Order", orderSchema);
export default Order;
