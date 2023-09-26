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

router.get("/calls", protect, getAllCalls);

router.post("/calls", protect, createCall);

router.get("/calls/:id", protect, getOneCall);

router.patch("/calls/:id", protect, updateCall);

router.delete("/calls/:id", protect, deleteCall);

module.exports = router;
