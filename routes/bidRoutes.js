const express = require("express");
const {
  getFreelancerBids,
  getBidStatus,
  updateBidStatus,
  placeBid,
} = require("../controllers/bidController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/fileUpload");

const router = express.Router();

router.get("/freelancer-bids", protect, getFreelancerBids);

router.get("/bid-status/:id", protect, getBidStatus);
router.patch("/update-bid-status/:id", protect, updateBidStatus);

router.post("/place-bid", protect, upload.array("files", 10), placeBid);

module.exports = router;
