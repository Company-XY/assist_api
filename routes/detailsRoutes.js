const express = require("express");
const {
  getAllDetails,
  createDetail,
  getOneDetail,
  updateDetail,
  deleteDetail,
} = require("../controllers/detailsController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Get all details
router.get("/details", protect, getAllDetails);

// Create a new detail
router.post("/details", protect, createDetail);

// Get a single detail by ID
router.get("/details/:id", protect, getOneDetail);

// Update a detail by ID
router.put("/details/:id", protect, updateDetail);

// Delete a detail by ID
router.delete("/details/:id", protect, deleteDetail);

module.exports = router;
