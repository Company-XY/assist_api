const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getAllJobs,
  getRecommendedJobs,
  createJob,
  getOneJob,
  updateJob,
  deleteJob,
  downloadJobFile,
  submitJob,
  getFeedJobs,
  approveJob,
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

router.get("/feed-jobs", getFeedJobs);

router
  .route("/jobs/:id")
  .get(getOneJob)
  .patch(upload.array("files", 10), updateJob)
  .delete(deleteJob);

router.post("/jobs/:id/approve", upload.array("files", 10), approveJob);
router.post("/jobs/:id/submit", upload.array("files", 10), submitJob);

router.get("/download/:jobId/:fileId", downloadJobFile);

module.exports = router;
