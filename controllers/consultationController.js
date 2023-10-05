const Call = require("../models/callModel");
const Details = require("../models/detailsModel");

const mergeController = {};

mergeController.getAllDetails = async (req, res) => {
  try {
    const calls = await Call.find();
    const details = await Details.find();

    const mergedData = [...calls, ...details];

    res.status(200).json(mergedData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = mergeController;
