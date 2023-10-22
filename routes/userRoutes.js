const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
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
  verifyEmailWithCode,
  sendEmailVerificationCode,
  sendPhoneVerificationCode,
  verifyPhoneWithCode,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getStatus);
router.get("/all/users", protect, getAllUser);
router.post("/login", loginUser);
router.post("/register/client", registerClient);
router.post("/register/freelancer", registerFreelancer);
router.post("/verify/email/code", verifyEmailWithCode);
router.post("/verify/phone/code", verifyPhoneWithCode);
router.post("/verify/email", sendEmailVerificationCode);
router.post("/verify/phone", sendPhoneVerificationCode);
router.post("/reset", sendResetLink);
router.post("/reset/password", resetPassword);
router.get("/profile/:id", getUserProfile);
router.get("/profile/other/:id", viewUserProfile);
router.patch("/profile/:id", updateUserProfile);

module.exports = router;
