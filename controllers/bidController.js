const asyncHandler = require("express-async-handler");
const Job = require("../models/jobModel");
const User = require("../models/userModel");

const createBid = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const { proposal, price, email } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existingBid = job.bids.find((bid) => bid.email === email);

    if (existingBid) {
      existingBid.proposal = proposal;
      existingBid.price = price;
    } else {
      const files = Array.isArray(req.files)
        ? req.files.map((file) => ({
            title: file.originalname,
            fileUrl: file.path,
          }))
        : [];
      const newBid = {
        email,
        proposal,
        price,
        files: files,
      };
      job.bids.push(newBid);
    }

    await job.save();

    res.status(201).json(job.bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a bid on a job
const updateBid = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const bidId = req.params.bidId;
    const { proposal, price, files, status } = req.body;

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
    bid.status = status;

    await job.save();

    res
      .status(200)
      .json({ message: "Bid updated successfully", updatedBid: bid });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific bids on a job
const getBids = asyncHandler(async (req, res) => {
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

// Update a bid on a job and change its status to ongoing
const awardBid = asyncHandler(async (req, res) => {
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

    if (bid.status !== "Pending") {
      return res.status(400).json({ message: "Bid cannot be awarded" });
    }

    const clientEmail = job.user_email;
    const client = await User.findOne({ email: clientEmail });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const freelancer = await User.findOne({ email: bid.email });

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    const jobBudget = job.budget;

    if (client.accountBalance < jobBudget) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    client.accountBalance -= jobBudget;
    freelancer.accountBalance += jobBudget;

    bid.status = "Ongoing";

    await job.save();
    await client.save();
    await freelancer.save();

    res.status(200).json({
      message: "Bid awarded and status changed to ongoing",
      awardedBid: bid,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all ongoing bids on a job
const getOngoingBid = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Filter the bids to get only those with status "ongoing"
    const ongoingBids = job.bids.filter((bid) => bid.status === "Ongoing");

    res.status(200).json({ ongoingBids });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  createBid,
  updateBid,
  getBids,
  deleteBid,
  awardBid,
  getOngoingBid,
};
