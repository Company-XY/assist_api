const asyncHandler = require("express-async-handler");
const Consultation = require("../models/consultationModel");

const bookConsultation = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      firstName,
      lastName,
      email,
      phoneNumber,
      date,
      time,
      date2,
      time2,
      description,
    } = req.body;

    const newConsultation = await Consultation.create({
      user: req.user._id,
      title,
      firstName,
      lastName,
      email,
      phoneNumber,
      date,
      time,
      date2,
      time2,
      description,
    });

    res.status(201).json(newConsultation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getConsultations = asyncHandler(async (req, res) => {
  try {
    const consultations = await Consultation.find({ user: req.user.id });
    res.status(200).json(consultations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const updateConsultationDateTime = asyncHandler(async (req, res) => {
  try {
    const consultationId = req.params.id;
    const { date, time } = req.body;

    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found." });
    }

    consultation.date = date;
    consultation.time = time;
    await consultation.save();

    res.status(200).json(consultation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  bookConsultation,
  getConsultations,
  updateConsultationDateTime,
};
