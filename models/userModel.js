const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["Client", "Freelancer"],
      required: [true, "Choose Your Role"],
    },
    type: {
      type: String,
      enum: [
        "Experienced VA",
        "Beginner VA",
        "Agency VA",
        "Inidividual Client",
        "Business Client",
      ],
      required: [true, "Select the type"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      minLength: 150,
    },
    name: {
      type: String,
      required: true,
      unique: [true, "Name has to be unique"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already in use"],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    consultation: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    accountBalance: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
    },
    contactInfo: {
      type: String,
    },
    experience: {
      type: String,
    },
    skills: {
      type: [String],
    },
    tasks: {
      type: [String],
    },
    availability: {
      type: String,
    },
    avatar: {
      title: String,
      fileUrl: String,
    },
    sampleWork: [
      {
        title: String,
        fileUrl: String,
      },
    ],
    paymentMethod: {
      type: String,
    },
    paymentRate: {
      type: Number,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiration: {
      type: Date,
    },
    rating: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
