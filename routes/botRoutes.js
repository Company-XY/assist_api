const express = require("express");
const { handleUserMessage } = require("../controllers/botController");
const router = express.Router();

router.post("/bot/message", handleUserMessage);

module.exports = router;
