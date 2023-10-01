const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createBid,
  updateBid,
  getBids,
  deleteBid,
  awardBid,
  getOngoingBid,
} = require("../controllers/bidController");
const { protect } = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

const router = express.Router();

router.post("/place-bid/:jobId", upload.array("files", 4), createBid);
router.patch("/update-bid/:jobId/:bidId", upload.array("files", 4), updateBid);
router.patch("/award-bid/:jobId/:bidId", awardBid);
router.get("/get-bids/:jobId", getBids);
router.get("/get-bid/:jobId", getOngoingBid);
router.delete("/delete-bid/:jobId/:bidId", deleteBid);

module.exports = router;
