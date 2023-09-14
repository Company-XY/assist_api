const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  depositFunds,
  transferFunds,
  withdrawToPayPal,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/:userId/deposit", protect, depositFunds);
router.post("/:senderId/transfer/:recipientId", protect, transferFunds);
router.post("/:userId/withdraw", protect, withdrawToPayPal);

module.exports = router;