const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const upload = require("../middlewares/fileUpload");
const crypto = require("crypto");
const axios = require("axios");
const bcrypt = require("bcrypt");

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
        type: user.type,
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
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

    const link = `https://beta-assist.netlify.app/password/${resetToken}`;
    const data = {
      from: "oloogeorge633@gmail.com",
      to: email,
      subject: "Password Reset",
      bodyText: `Click the link to reset your password: ${link} .......Assist Africa`,
      apiKey: ELASTIC_EMAIL_API_KEY,
    };

    const response = await axios({
      method: "post",
      url: "https://api.elasticemail.com/v2/email/send",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data.success) {
      res
        .status(200)
        .json({ message: `Password reset link sent successfully.` });
    } else {
      res.status(500).json({ message: response.data.error });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
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
        availability: user.availability,
        tasks: user.tasks,
        sampleWork: user.sampleWork,
        paymentMethod: user.paymentMethod,
        paymentRate: user.paymentRate,
        rating: user.rating,
        isVerified: user.isVerified,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update user profile
// Controller to update user details
const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // Fetch the user data to get the existing sampleWork array
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      // Update the avatar with the new file (overwriting the current one)
      updateFields.avatar = {
        title: req.file.originalname,
        fileUrl: req.file.path,
      };
    }

    if (req.files && req.files["sampleWork"]) {
      // Retrieve the existing sampleWork files (if any)
      const existingSampleWork = user.sampleWork || [];

      // Append the new sampleWork files to the existing ones (up to 5)
      const newSampleWorkFiles = req.files["sampleWork"]
        .slice(0, 5)
        .map((file) => ({
          title: file.originalname,
          fileUrl: file.path,
        }));

      // Merge the existing files with the new files
      updateFields.sampleWork = [...existingSampleWork, ...newSampleWorkFiles];
    }

    // Update the user with the merged updateFields
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
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
        availability: user.availability,
        tasks: user.tasks,
        sampleWork: user.sampleWork,
        paymentMethod: user.paymentMethod,
        paymentRate: user.paymentRate,
        rating: user.rating,
        isVerified: user.isVerified,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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
};
