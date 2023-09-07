const express = require("express");
const upload = require("../middlewares/fileUpload");
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
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getStatus);
router.get("/all/users", protect, getAllUser);
router.post("/login", loginUser);
router.post("/register/client", registerClient);
router.post("/register/freelancer", registerFreelancer);
router.post("/reset", sendResetLink);
router.post("/reset/password", resetPassword);
router.get("/profile/:id", protect, getUserProfile);
router.get("/profile/other/:id", protect, viewUserProfile);
router.patch(
  "/profile/:id",
  protect,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "sampleWork", maxCount: 5 },
  ]),
  updateUserProfile
);

module.exports = router;
