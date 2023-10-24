const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const generateRandomVerificationCode = require("../middlewares/emailVerificationCode");
const crypto = require("crypto");
const axios = require("axios");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const qs = require("qs");
const cloudinary = require("../utils/cloudinary");
const upload = require("../middlewares/multer");

//VARIABLES
//To be transferred to dotenv file
const username = "oloskoSMS";
const apiKey =
  "8ab95cd2433328c88c23ee970ced16f60b9fbf3e3129940811ab5fae1d2a2204";
const apiUrl = "https://api.africastalking.com/version1/messaging";

const ELASTIC_EMAIL_API_KEY = process.env.ELASTIC_EMAIL_API_KEY;
////AUTHENTICATION
//Register Freelancer
const registerFreelancer = asyncHandler(async (req, res) => {
  const role = "Freelancer";
  const { type, email, name, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const passwordPattern =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include at least one letter, one number, and one special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      role,
      type,
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      const token = generateToken(user._id);

      res.status(201).json({
        _id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
        type: user.type,
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Register Client
const registerClient = asyncHandler(async (req, res) => {
  const role = "Client";
  const { type, email, name, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const passwordPattern =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include at least one letter, one number, and one special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      role,
      type,
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      const token = generateToken(user._id);

      res.status(201).json({
        _id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
        type: user.type,
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
});

//Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);

    res.json({
      _id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      token: token,
    });
  } else {
    res.status(401).json("Invalid Email or Password");
  }
});

//////PASSWORD RESET
//Request Reset Link
const sendResetLink = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    const name = user.name;

    const link = `https://beta-assist.netlify.app/password/${resetToken}`;
    const data = {
      from: "oloogeorge633@gmail.com",
      to: email,
      subject: "Password Reset",
      body: `
        <html>
        <head>
          <style>
            /* Add your CSS styles here */
            body {
              font-family: Arial, sans-serif;
              background: linear-gradient(to bottom, #007ACC, #007ACC, #00f);
              background-repeat: repeat;
              color: white;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
            }
            h2 {
              color: blue;
              font-size: 28px;
            }
            p {
              font-size: 18px;
            }
            a {
              color: blue;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 style="color: blue;">Assist Africa</h2>
            <p>Hello, ${name}!</p>
            <p>Your password reset link is:</p>
            <p><a href="${link}" style="color: blue; text-decoration: none;">${link}</a></p>
          </div>
        </body>
        </html>
      `,
      apiKey: ELASTIC_EMAIL_API_KEY,
    };

    const response = await axios.post(
      "https://api.elasticemail.com/v2/email/send",
      new URLSearchParams(data).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data.success) {
      res
        .status(200)
        .json({ message: "Password reset link sent successfully." });
    } else {
      res.status(500).json({ message: response.data.error });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Verify Link and Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    const passwordPattern =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include at least one letter, one number, and one special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
});

/////PROFILE
//Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json("User Not Found");
    } else {
      res.json({
        _id: user._id,
        role: user.role,
        type: user.type,
        bio: user.bio,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        isApproved: user.isApproved,
        consultation: user.consultation,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
        accountBalance: user.accountBalance,
        location: user.location,
        contactInfo: user.contactInfo,
        avatar: user.avatar,
        experience: user.experience,
        skills: user.skills,
        certifications: user.certifications,
        availability: user.availability,
        tasks: user.tasks,
        sampleWork: user.sampleWork,
        paymentMethod: user.paymentMethod,
        paymentRate: user.paymentRate,
        rating: user.rating,
        isPremium: user.isPremium,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (updateFields.phone && updateFields.phone !== user.phone) {
      const existingUser = await User.findOne({ phone: updateFields.phone });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Phone number is already in use" });
      }
    }

    upload.single("avatar")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading file" });
      }

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);

        // Update the user's avatar information in the database
        user.avatar = {
          title: req.file.originalname,
          imageUrl: result.secure_url,
        };
      }

      // Update other profile fields based on the keys in updateFields
      for (const key in updateFields) {
        if (key !== "avatar") {
          user[key] = updateFields[key];
        }
      }

      const updatedUser = await user.save();

      res.status(200).json(updatedUser);
    });
  } catch (error) {
    res.status(400).json(error);
    console.error(error);
  }
});

//Get another user's profile
const viewUserProfile = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json("User Not Found");
    } else {
      res.json({
        _id: user._id,
        role: user.role,
        type: user.type,
        bio: user.bio,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        isApproved: user.isApproved,
        consultation: user.consultation,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
        location: user.location,
        contactInfo: user.contactInfo,
        avatar: user.avatar,
        experience: user.experience,
        skills: user.skills,
        certifications: user.certifications,
        availability: user.availability,
        tasks: user.tasks,
        sampleWork: user.sampleWork,
        paymentMethod: user.paymentMethod,
        paymentRate: user.paymentRate,
        rating: user.rating,
        isPremium: user.isPremium,
        isVerified: user.isVerified,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//POST verify email
const sendEmailVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const verificationCode = generateRandomVerificationCode();
    user.verificationCode = verificationCode;
    await user.save();

    const name = user.name;

    const emailData = {
      from: "oloogeorge633@gmail.com",
      to: email,
      subject: "Email Verification Code",
      body: `
        <html>
        <head>
          <style>
            /* Add your CSS styles here */
            body {
              font-family: Arial, sans-serif;
              background: linear-gradient(to bottom, #00f, #007ACC, #007ACC);
              background-repeat: repeat;
              color: white;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
            }
            h1 {
              color: blue;
              font-size: 40px;
            }
            h2 {
              font-size: 28px;
            }
            p {
              font-size: 18px;
            }
            span{
              color: blue;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Assist Africa</h1>
            <h2>Hello, ${name}!</h2>
            <p>Your email verification code is: <span>${verificationCode}</span></p>
          </div>
        </body>
        </html>
      `,
      apiKey: process.env.ELASTIC_EMAIL_API_KEY,
    };

    // Send the email using Elastic Email API
    const response = await axios.post(
      "https://api.elasticemail.com/v2/email/send",
      new URLSearchParams(emailData).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data.success) {
      res.status(200).json({ message: "Verification code sent successfully." });
    } else {
      res.status(500).json({ message: response.data.error });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      message: "An error occurred while sending the verification code.",
    });
  }
});

//POST VErify email with code
const verifyEmailWithCode = asyncHandler(async (req, res) => {
  const { code, email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    user.emailVerified = true;
    user.verificationCode = null;
    await user.save();

    res.status(200).json({ message: "Email verification successful." });
  } catch (error) {
    res.status(500).json(error);
  }
});

//PHONE VERIFICATIONS................
// Send verification code

const sendPhoneVerificationCode = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  // Calculate the expiration time, which is 10 minutes from the current time
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 10);

  const smsData = {
    username: username,
    to: phoneNumber,
    message: `Your Assist Africa Phone Number Verification Code is: ${verificationCode}. The Code will Expire in Ten Minutes`,
  };

  try {
    const response = await axios.post(apiUrl, qs.stringify(smsData), {
      headers: {
        apiKey: apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.status === 201) {
      await User.updateOne(
        { phone: phoneNumber },
        {
          phoneVerificationCode: verificationCode,
          phoneVerificationCodeExpiresAt: expirationTime,
        }
      );

      res.json({ message: "Verification code sent successfully" });
    } else {
      res.status(500).json({ error: "Failed to send SMS" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error sending SMS" });
  }
});

//VERIFY WITH CODE
// Verify phone with code
const verifyPhoneWithCode = asyncHandler(async (req, res) => {
  const { code, phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phone: phoneNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (
      user.phoneVerificationCode !== code ||
      user.phoneVerificationCodeExpiresAt < new Date()
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
    }

    user.phoneVerified = true;
    user.phoneVerificationCode = null;
    user.phoneVerificationCodeExpiresAt = null;

    await user.save();

    res.json({ message: "Phone verification successful." });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while verifying the phone with the code.",
    });
  }
});

///////MISC//////////////////////////////////////
//Test Server Status
const getStatus = asyncHandler(async (req, res) => {
  try {
    res.status(200).json("Server Status is Okay");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET all users
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  registerClient,
  registerFreelancer,
  loginUser,
  getStatus,
  sendResetLink,
  resetPassword,
  getAllUser,
  getUserProfile,
  viewUserProfile,
  updateUserProfile,
  sendEmailVerificationCode,
  verifyEmailWithCode,
  sendPhoneVerificationCode,
  verifyPhoneWithCode,
};
