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

router.get("/calls", getAllCalls);

router.post("/calls", createCall);

router.get("/calls/:id", getOneCall);

router.patch("/calls/:id", updateCall);

router.delete("/calls/:id", deleteCall);

module.exports = router;
