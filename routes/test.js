const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getAllJobs,
  getFeedJobs,
  getOneJob,
  createJob,
  updateJob,
  deleteJob,
  getUserJobs,
  submitJob,
  downloadJobFile,
  disputeJob,
  reviewAndApproveJob,
  downloadProductFile,
  addReviewAndRating,
} = require("../controllers/JobsController");
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

router
  .route("/jobs")
  .get(getAllJobs)
  .post(upload.array("files", 10), createJob);

router.post("/jobs/:jobId", addReviewAndRating);
router.get("/jobs-feed", getFeedJobs);
router.patch("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);
router.get("/jobs/:id", getOneJob);
router.patch("/jobs/submit/:id", submitJob);
router.patch("/jobs/review/:id", reviewAndApproveJob);
router.patch("/jobs/dispute/:id", disputeJob);
router.get("/jobs/download/:jobId/:fileId", downloadJobFile);
router.get("/product/download/:jobId/:fileId", downloadProductFile);
router.get("/user/jobs", getUserJobs);

module.exports = router;
