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

router.get("/details", protect, getAllDetails);

router.post("/details", protect, createDetail);

router.get("/details/:id", protect, getOneDetail);

router.patch("/details/:id", protect, updateDetail);

router.delete("/details/:id", protect, deleteDetail);

module.exports = router;
