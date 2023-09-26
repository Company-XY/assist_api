const mongoose = require("mongoose");

const detailsSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    businessName: {
      type: String,
    },
    prGoals: {
      type: String,
    },
    budget: {
      type: String,
    },
    bids: {
      type: Number,
      default: 0,
    },
    status: {
      type: [String],
      enum: ["Pending", "Ongoing", "Complete", "Under Review", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Details = mongoose.model("Details", detailsSchema);

module.exports = Details;
