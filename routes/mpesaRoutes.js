const express = require("express");
const router = express.Router();
const { initiatePayment } = require("../controllers/mpesaController");

router.post("/initiate-payment", initiatePayment);

module.exports = router;
