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
  .get(getAllJobs) // Protect the route to allow only authenticated users
  .post(upload.array("files", 10), createJob); // Protect the route to allow only authenticated users

// Route for handling recommended jobs
router.route("/jobs/recommended").get(getRecommendedJobs);

// Routes for handling individual job
router
  .route("/jobs/:id")
  .get(getOneJob)
  .patch(upload.array("files", 10), updateJob) // Protect the route to allow only authenticated users
  .delete(deleteJob); // Protect the route to allow only authenticated users

// Route for fetching user-specific jobs
router.get("/user-jobs/:userEmail", getUserJobs); // Protect the route to allow only authenticated users

// Route for getting bids for a job
router.get("/job-bids/:id", getJobBids);

module.exports = router;
