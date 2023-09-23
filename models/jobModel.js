const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Services: {
      type: String,
      enum: [
        "Brand Messaging",
        "Crisis Management",
        "Event Planning",
        "Influencer Outreach",
        "Media Relations",
        "Press Release Writing",
        "Social Media Management",
        "Strategic Communication",
        "Web Development",
        "Content Creation",
        "Reputation Management",
        "Community Engagement",
        "Digital Marketing",
        "Market Research",
        "Publicity Campaigns",
        "Thought Leadership",
      ],
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
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
