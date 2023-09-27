const mongoose = require("mongoose");

const bidSchema = mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    user: {
      type: String,
    },
    email: {
      type: String,
    },
    proposal: {
      type: String,
    },
    price: {
      type: Number,
    },
    files: [
      {
        title: String,
        fileUrl: String,
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
