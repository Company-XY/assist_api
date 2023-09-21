const express = require("express");
const {
  bookConsultation,
  getConsultations,
  updateConsultationDateTime,
} = require("../controllers/consultationController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/consultations")
  .post(protect, bookConsultation)
  .get(protect, getConsultations);
router
  .route("/consultations/:id/update-datetime")
  .patch(protect, updateConsultationDateTime);

module.exports = router;
