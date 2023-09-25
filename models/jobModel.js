const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Services: {
      type: String,
    },
    user_email: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    files: [
      {
        title: String,
        fileUrl: String,
      },
    ],
    skills: {
      type: [String],
    },
    duration: {
      type: Number,
      required: true,
    },
    budget: {
      type: String,
      required: true,
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

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
