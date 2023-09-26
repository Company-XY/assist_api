const asyncHandler = require("express-async-handler");
const Bid = require("../models/bidModel");
const Job = require("../models/jobModel");

const getFreelancerBids = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const bids = await Bid.find({ user: userId });
    res.status(200).json(bids);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const getBidStatus = asyncHandler(async (req, res) => {
  try {
    const bidId = req.params.id;
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found." });
    }
    res.status(200).json({ status: bid.status });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const updateBidStatus = asyncHandler(async (req, res) => {
  try {
    const bidId = req.params.id;
    const { status } = req.body;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found." });
    }

    bid.status = status;
    await bid.save();

    res.status(200).json({ status: bid.status });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const placeBid = asyncHandler(async (req, res) => {
  try {
    const { job_id, proposal, price } = req.body;

    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const files = req.files.map((file) => ({
      title: file.originalname,
      fileUrl: file.path,
    }));

    const newBid = await Bid.create({
      job: job_id,
      user: req.user.id,
      user_email: req.user.email,
      proposal,
      price,
      files,
      status: "pending",
    });

    job.bids.push(newBid._id);
    await job.save();

    res.status(201).json(newBid);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  getFreelancerBids,
  getBidStatus,
  updateBidStatus,
  placeBid,
};
