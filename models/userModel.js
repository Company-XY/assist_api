const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["Client", "Freelancer", "Admin"],
      required: [true, "Choose Your Role"],
    },
    type: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
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
      unique: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerificationCode: {
      type: String,
    },
    phoneVerificationCodeExpiresAt: {
      type: Date,
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
    certifications: [
      {
        title: String,
        image: String,
        link: String,
      },
    ],
    tasks: {
      type: [String],
    },
    availability: {
      type: String,
    },
    avatar: {
      type: String,
    },
    sampleWork: {
      type: String,
    },
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
    isPremium: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
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
