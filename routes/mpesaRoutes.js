const express = require("express");
const { createToken, stkPush } = require("../controllers/mpesaController");

const router = express.Router();

router.post("/deposit", createToken, stkPush);

module.exports = router;
