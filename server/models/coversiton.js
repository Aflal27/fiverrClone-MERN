import mongoose from "mongoose";

const coverstionSchema = new mongoose.Schema(
  {
    member: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Converstion = mongoose.model("Converstion", coverstionSchema);
export default Converstion;
