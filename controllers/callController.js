const asyncHandler = require("express-async-handler");
const Call = require("../models/callModel");

const getAllCalls = asyncHandler(async (req, res) => {
  try {
    const calls = await Call.find();
    res.status(200).json(calls);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const createCall = asyncHandler(async (req, res) => {
  try {
    const { phone, businessName, prGoals, budget, time, date, time2, date2 } =
      req.body;

    const { name, email } = req.user;

    const newCall = await Call.create({
      name,
      email,
      phone,
      businessName,
      prGoals,
      budget,
      time,
      date,
      time2,
      date2,
    });

    res.status(201).json(newCall);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getOneCall = asyncHandler(async (req, res) => {
  try {
    const oneCall = await Call.findById(req.params.id);
    res.status(200).json(oneCall);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const updateCall = asyncHandler(async (req, res) => {
  try {
    const callId = req.params.id;
    const updateFields = req.body;

    const existingCall = await Call.findById(callId);

    if (!existingCall) {
      return res.status(404).json({ message: "Call not found" });
    }

    const updatedCall = await Call.findByIdAndUpdate(callId, updateFields, {
      new: true,
    });

    res.status(200).json(updatedCall);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});

const deleteCall = asyncHandler(async (req, res) => {
  try {
    const deletedCall = await Call.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted Successfully");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = {
  getAllCalls,
  createCall,
  getOneCall,
  updateCall,
  deleteCall,
};
