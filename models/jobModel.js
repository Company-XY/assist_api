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
    name: {
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
    bids: [
      {
        email: String,
        proposal: String,
        files: [
          {
            title: String,
            fileUrl: String,
          },
        ],
        price: {
          type: Number,
        },
        status: {
          type: String,
          enum: ["Pending", "Ongoing", "Complete"],
          default: "Pending",
        },
      },
    ],
    product: {
      files: [
        {
          title: String,
          fileUrl: String,
        },
      ],
    },
    stage: {
      type: String,
      enum: ["Pending", "Ongoing", "UnderReview", "Disputed", "Complete"],
      default: "Pending",
    },
    paymentVerified: {
      type: Boolean,
      default: false,
    },
    review: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
