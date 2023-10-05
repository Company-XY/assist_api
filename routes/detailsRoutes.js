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

router.get("/details", getAllDetails);

router.post("/details", createDetail);

router.get("/details/:id", getOneDetail);

router.patch("/details/:id", updateDetail);

router.delete("/details/:id", deleteDetail);

module.exports = router;
