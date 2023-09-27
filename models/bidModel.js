const mongoose = require("mongoose");

const bidSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    user_email: {
      type: String,
      required: true,
    },
    proposal: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    files: [
      {
        title: String,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Bid = mongoose.model("Bid", bidSchema);

module.exports = Bid;
