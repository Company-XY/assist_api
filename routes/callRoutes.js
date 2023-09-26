const express = require("express");
const {
  getAllCalls,
  createCall,
  getOneCall,
  updateCall,
  deleteCall,
} = require("../controllers/callController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Get all calls
router.get("/calls", protect, getAllCalls);

// Create a new call
router.post("/calls", protect, createCall);

// Get a single call by ID
router.get("/calls/:id", protect, getOneCall);

// Update a call by ID
router.put("/calls/:id", protect, updateCall);

// Delete a call by ID
router.delete("/calls/:id", protect, deleteCall);

module.exports = router;
