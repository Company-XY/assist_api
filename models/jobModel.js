const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    PR_Services: {
      type: String,
      required: true,
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
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
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
    skills: [
      {
        value: String,
        label: String,
      },
    ],
    duration: {
      type: Number,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;