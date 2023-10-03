const asyncHandler = require("express-async-handler");
const Job = require("../models/jobModel");

//------------------------PURELY JOBS RELATED FULL CRUD------------------//
//-----START
//GET ALL JOBS
//All jobs regardless of the stage they are in
//GET METHOD
const getAllJobs = asyncHandler(async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//GET feed jobs to be dislayed for the freelancer
//Stage is still set to "Pending"
//GET METHOD
const getFeedJobs = asyncHandler(async (req, res) => {
  try {
    const pendingJobs = await Job.find({ stage: "Pending" });
    res.status(200).json(pendingJobs);
  } catch (error) {
    res.status(500).json(error);
  }
});

//CREATE a job posting
//POST METHOD
const createJob = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      Services,
      description,
      user_email,
      name,
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
      name,
      title,
      Services,
      description,
      skills,
      budget,
      duration,
      files,
    });

    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//GET a single job
//GET the job despite the stage
//GET METHOD
const getOneJob = asyncHandler(async (req, res) => {
  try {
    const oneJob = await Job.findById(req.params.id);
    res.status(200).json(oneJob);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//UPDATE a single job
//PATCH the job with necessary changes from the body
//PATCH METHOD
const updateJob = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.id;
    const updateFields = req.body;

    const existingJob = await Job.findById(jobId);

    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateFields, {
      new: true,
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json(error);
    console.error(error);
  }
});

//DELETE a single job
//DELETE METHOD
const deleteJob = asyncHandler(async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted Successfully");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//------------------END
//------------------------PURELY JOBS RELATED FULL CRUD------------------//
//-----------------------------------------------------------------------//

//------------USER FUNCTIONS---------------------------------------------//

//GET USER JOBS
//Retrieve a list of jobs posted by a given user
//GET METHOD
const getUserJobs = asyncHandler(async (req, res) => {
  try {
    const email = req.body.email;

    const userJobs = await Job.find({ user_email: email });

    if (!userJobs) {
      return res
        .status(404)
        .json({ message: "No jobs found for the specified user email" });
    }

    res.status(200).json(userJobs);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});

//SUBMIT Jobs
//PATCH METHOD
const submitJob = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.id;
    const updateFields = req.body;

    const existingJob = await Job.findById(jobId);

    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (req.files && req.files["product"]) {
      const existingProductFiles = existingJob.product.files || [];

      const newProductFiles = req.files["product"].map((file) => ({
        title: file.originalname,
        fileUrl: file.path,
      }));

      updateFields.product = {
        files: [...existingProductFiles, ...newProductFiles],
      };
    }
    console.log(updateFields);
    updateFields.stage = "UnderReview";

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateFields, {
      new: true,
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json(error);
    console.error(error);
  }
});

//REVIEW Then approve job
//PATCH METHOD
const reviewAndApproveJob = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.id;
    const { review, satisfied } = req.body;

    const updateFields = {};

    if (review) {
      updateFields.review = review;
    }

    if (satisfied) {
      updateFields.stage = "Complete";
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: updateFields },
      {
        new: true,
      }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (updatedJob.stage !== "UnderReview") {
      return res
        .status(400)
        .json({ message: "Job is not in a reviewable state" });
    }

    if (updatedJob.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});

//Dispute a given job
//PATCH METHOD
const disputeJob = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.id;

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: { stage: "Disputed" } },
      {
        new: true,
      }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (updatedJob.stage !== "UnderReview") {
      return res
        .status(400)
        .json({ message: "Job is not in a reviewable state" });
    }

    if (updatedJob.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});

//DOWNLOAD job files
//GET METHOD
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

module.exports = {
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
};
