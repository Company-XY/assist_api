const asyncHandler = require("express-async-handler");
const Job = require("../models/jobModel");

// Create a product for a job
const createProduct = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const { name, review, files } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const product = {
      name,
      review,
      files: Array.isArray(req.files)
        ? req.files.map((file) => ({
            title: file.originalname,
            fileUrl: file.path,
          }))
        : [],
    };

    job.product = product;

    job.stage = "UnderReview";

    await job.save();

    res.status(201).json(job.product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a product for a job
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const { name, review, files } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.product.name = name;
    job.product.review = review;
    job.product.files = Array.isArray(req.files)
      ? req.files.map((file) => ({
          title: file.originalname,
          fileUrl: file.path,
        }))
      : [];

    await job.save();

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct: job.product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get the product for a job
const getProduct = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ product: job.product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  createProduct,
  updateProduct,
  getProduct,
};
