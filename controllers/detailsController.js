const asyncHandler = require("express-async-handler");
const Details = require("../models/detailsModel");

const getAllDetails = asyncHandler(async (req, res) => {
  try {
    const details = await Details.find();
    res.status(200).json(details);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const createDetail = asyncHandler(async (req, res) => {
  try {
    const { businessName, prGoals, budget } = req.body;

    const { name, email } = req.user;

    const newDetail = await Details.create({
      name,
      email,
      businessName,
      prGoals,
      budget,
    });

    res.status(201).json(newDetail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getOneDetail = asyncHandler(async (req, res) => {
  try {
    const detail = await Details.findById(req.params.id);
    if (!detail) {
      return res.status(404).json({ message: "Detail not found" });
    }
    res.status(200).json(detail);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const updateDetail = asyncHandler(async (req, res) => {
  try {
    const detailId = req.params.id;
    const updateFields = req.body;

    const existingDetail = await Details.findById(detailId);

    if (!existingDetail) {
      return res.status(404).json({ message: "Detail not found" });
    }

    const updatedDetail = await Details.findByIdAndUpdate(
      detailId,
      updateFields,
      {
        new: true,
      }
    );

    res.status(200).json(updatedDetail);
  } catch (error) {
    res.status(400).json(error);
  }
});

const deleteDetail = asyncHandler(async (req, res) => {
  try {
    const deletedDetail = await Details.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted Successfully");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = {
  getAllDetails,
  createDetail,
  getOneDetail,
  updateDetail,
  deleteDetail,
};
