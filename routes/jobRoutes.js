const express = require("express");
const {
  getAllJobs,
  getUserJobs,
  getRecommendedJobs,
  createJob,
  getOneJob,
  updateJob,
  deleteJob,
  getJobBids,
} = require("../controllers/jobController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/fileUpload");

const router = express.Router();

// Routes for handling all jobs
router
  .route("/jobs")
  .get(protect, getAllJobs) // Protect the route to allow only authenticated users
  .post(protect, upload.array("files", 10), createJob); // Protect the route to allow only authenticated users

// Route for handling recommended jobs
router.route("/jobs/recommended").get(protect, getRecommendedJobs);

// Routes for handling individual job
router
  .route("/jobs/:id")
  .get(getOneJob)
  .patch(protect, upload.array("files", 10), updateJob) // Protect the route to allow only authenticated users
  .delete(protect, deleteJob); // Protect the route to allow only authenticated users

// Route for fetching user-specific jobs
router.get("/user-jobs/:userEmail", protect, getUserJobs); // Protect the route to allow only authenticated users

// Route for getting bids for a job
router.get("/job-bids/:id", getJobBids);

module.exports = router;
