const express = require("express");
const { upload } = require("../middlewares/fileUpload");
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
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getStatus);
router.get("/all/users", getAllUser);
router.post("/login", loginUser);
router.post("/register/client", registerClient);
router.post("/register/freelancer", registerFreelancer);
router.post("/reset", sendResetLink);
router.post("/reset/password", resetPassword);
router.get("/profile/:id", getUserProfile);

module.exports = router;
