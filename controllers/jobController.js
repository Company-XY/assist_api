const asyncHandler = require("express-async-handler");
const Job = require("../models/jobModel");
const Bid = require("../models/bidModel");
const User = require("../models/userModel");

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
    return commonSkills.length / userSkills.length; // Simple similarity calculation
  };
  try {
    try {
      const userId = req.user.id; // Assuming user authentication
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

      const topRecommendedJobs = recommendedJobs.slice(0, 10); // Select top 10 recommendations

      res.status(200).json(topRecommendedJobs);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const getUserJobs = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const jobs = await Job.find({ user: userId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const createJob = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      PR_Services,
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
      PR_Services,
      description,
      skills,
      budget,
      duration,
      files,
    });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(402).json({ message: error.message });
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
    const { files: newFiles } = req.body;

    // Retrieve the existing job document from the database.
    const existingJob = await Job.findById(jobId);

    if (!existingJob) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Append the new file(s) to the existing files array.
    if (Array.isArray(newFiles) && newFiles.length > 0) {
      existingJob.files = existingJob.files.concat(newFiles);
    }

    // Save the updated job document.
    const updatedJob = await existingJob.save();

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

const getJobBids = asyncHandler(async (req, res) => {
  try {
    const jobBids = await Bid.find({ job: req.params.id });
    res.status(200).json(jobBids);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = {
  getAllJobs,
  getUserJobs,
  getRecommendedJobs,
  createJob,
  getOneJob,
  updateJob,
  deleteJob,
  getJobBids,
};
