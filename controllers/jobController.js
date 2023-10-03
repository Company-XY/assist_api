const asyncHandler = require("express-async-handler");
const Job = require("../models/jobModel");
const User = require("../models/userModel");

const getFeedJobs = asyncHandler(async (req, res) => {
  try {
    const pendingJobs = await Job.find({ stage: "Pending" });
    res.status(200).json(pendingJobs);
  } catch (error) {
    res.status(500).json(error);
  }
});

const getAllJobs = asyncHandler(async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const getRecommendedJobs = asyncHandler(async (req, res) => {
  const calculateSkillSimilarity = (userSkills, jobRequiredSkills) => {
    const commonSkills = userSkills.filter((skill) =>
      jobRequiredSkills.includes(skill)
    );
    return commonSkills.length / userSkills.length;
  };
  try {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      const jobs = await Job.find();

      const recommendedJobs = [];

      for (const job of jobs) {
        const skillSimilarity = calculateSkillSimilarity(
          user.skills,
          job.requiredSkills
        );
        recommendedJobs.push({ job, skillSimilarity });
      }

      recommendedJobs.sort((a, b) => b.skillSimilarity - a.skillSimilarity);

      const topRecommendedJobs = recommendedJobs.slice(0, 10);

      res.status(200).json(topRecommendedJobs);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const createJob = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      Services,
      description,
      user_email,
      skills,
      budget,
      duration,
    } = req.body;
    if (!user_email) {
      return res.status(400).json({ message: "User email not found." });
    }

    const files = Array.isArray(req.files)
      ? req.files.map((file) => ({
          title: file.originalname,
          fileUrl: file.path,
        }))
      : [];

    const newJob = await Job.create({
      user_email,
      title,
      Services,
      description,
      skills,
      budget,
      duration,
      files,
      bids: [],
      product: {},
    });

    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getOneJob = asyncHandler(async (req, res) => {
  try {
    const oneJob = await Job.findById(req.params.id);
    res.status(200).json(oneJob);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const updateJob = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.id;
    const updateFields = req.body;

    const existingJob = await Job.findById(jobId);

    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (req.files && req.files["files"]) {
      const existingFiles = existingJob.files || [];

      const newFiles = req.files["files"].map((file) => ({
        title: file.originalname,
        fileUrl: file.path,
      }));

      updateFields.files = [...existingFiles, ...newFiles];
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateFields, {
      new: true,
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});

const deleteJob = asyncHandler(async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted Successfully");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const downloadJobFile = asyncHandler(async (req, res) => {
  const { jobId, fileId } = req.params;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const file = job.files.id(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const filename = file.title;
    const filePath = file.fileUrl;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.status(200).download(filePath);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const submitJob = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.stage === "Complete") {
      return res
        .status(400)
        .json({ message: "Job is already marked as Complete" });
    }

    const uploadedFiles = req.files.map((file) => ({
      title: file.originalname,
      fileUrl: file.path,
    }));

    job.product = {
      files: uploadedFiles,
      review: req.body.review,
    };

    job.stage = "UnderReview";
    await job.save();

    res
      .status(200)
      .json({ message: "Job completed and under review", updatedJob: job });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const approveJob = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.stage === "Complete") {
      return res.status(400).json({ message: "Job is already marked as Complete" });
    }

    const uploadedFiles = req.files ? req.files.map((file) => ({
      title: file.originalname,
      fileUrl: file.path,
    })) : [];

    job.product = {
      files: uploadedFiles,
      review: req.body.review,
    };
    job.stage = "Complete";

    await job.save();

    res.status(200).json({ message: "Job approved and marked as Complete", updatedJob: job });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  getAllJobs,
  getRecommendedJobs,
  createJob,
  getOneJob,
  updateJob,
  deleteJob,
  downloadJobFile,
  submitJob,
  getFeedJobs,
  approveJob
};
