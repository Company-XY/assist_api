const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const {
  getAllJobs,
  getUserJobs,
  getRecommendedJobs,
  createJob,
  getOneJob,
  updateJob,
  deleteJob,
  getJobBids,
  downloadJobFile,
} = require("../controllers/jobController");
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
router.route("/jobs/recommended").get(getRecommendedJobs);
router
  .route("/jobs/:id")
  .get(getOneJob)
  .patch(upload.array("files", 10), updateJob)
  .delete(deleteJob);

router.get("/user-jobs/:userEmail", getUserJobs);

router.get("/download/:jobId/:fileId", downloadJobFile);

router.get("/job-bids/:id", getJobBids);

module.exports = router;
