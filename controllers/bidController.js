const asyncHandler = require("express-async-handler");
const Bid = require("../models/bidModel");
const Job = require("../models/jobModel");

// Create a bid for a job
const createBid = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user._id;
    const { proposal, price } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the user has already placed a bid on this job
    const existingBid = job.bids.find((bid) => bid.user.equals(userId));

    if (existingBid) {
      existingBid.proposal = proposal;
      existingBid.price = price;
    } else {
      const newBid = {
        user: userId,
        proposal,
        price,
        files: [],
      };
      job.bids.push(newBid);
    }

    await job.save();

    res.status(201).json({ message: "Bid created or updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a bid on a job
const updateBid = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const bidId = req.params.bidId;
    const { proposal, price, files } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const bid = job.bids.id(bidId);

    if (!bid) {
      return res.status(404).json({ message: "Bid not found on this job" });
    }

    // Update the bid properties
    bid.proposal = proposal;
    bid.price = price;
    bid.files = files;

    await job.save();

    res
      .status(200)
      .json({ message: "Bid updated successfully", updatedBid: bid });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific bid on a job
const getBid = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const bidId = req.params.bidId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const bid = job.bids.id(bidId);

    if (!bid) {
      return res.status(404).json({ message: "Bid not found on this job" });
    }

    res.status(200).json({ bid });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a bid on a job
const deleteBid = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const bidId = req.params.bidId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const bid = job.bids.id(bidId);

    if (!bid) {
      return res.status(404).json({ message: "Bid not found on this job" });
    }

    bid.remove();
    await job.save();

    res.status(200).json({ message: "Bid deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  createBid,
  updateBid,
  getBid,
  deleteBid,
};
