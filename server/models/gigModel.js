import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    descriptiion: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: false,
    },
    sales: {
      type: Number,
      default: 0,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    pinnedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: Boolean,
      default: false,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    base: {
      baseDays: {
        type: Number,
        required: true,
        default: 0,
      },
      baseDescription: {
        type: String,
        required: true,
      },
      basePrice: {
        type: Number,
        required: true,
        default: 0,
      },
      baseRevision: {
        type: Number,
        required: true,
        default: 0,
      },

      baseTitle: {
        type: String,
        required: true,
      },
    },
    silver: {
      silverDays: {
        type: Number,
        required: true,
        default: 0,
      },
      silverDescription: {
        type: String,
        required: true,
      },
      silverPrice: {
        type: Number,
        required: true,
        default: 0,
      },
      silverRevision: {
        type: Number,
        required: true,
        default: 0,
      },

      silverTitle: {
        type: String,
        required: true,
      },
    },
    platinum: {
      platinumDays: {
        type: Number,
        required: true,
        default: 0,
      },
      platinumDescription: {
        type: String,
        required: true,
      },
      platinumPrice: {
        type: Number,
        required: true,
        default: 0,
      },
      platinumRevision: {
        type: Number,
        required: true,
        default: 0,
      },

      platinumTitle: {
        type: String,
        required: true,
      },
    },
  },

  { timestamps: true }
);

const Gig = mongoose.model("Gig", gigSchema);
export default Gig;
