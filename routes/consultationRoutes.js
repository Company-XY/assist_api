const express = require("express");
const { getAllDetails } = require("../controllers/consultationController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/consultations", getAllDetails);

module.exports = router;
