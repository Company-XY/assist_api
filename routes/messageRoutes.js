const express = require("express");
const router = express.Router();
const messagingController = require("../controllers/messaging");

// WebSocket route to handle WebSocket connection
router.ws("/chat", (ws, req) => {
  ws.on("message", (message) => {
    // Parse the incoming JSON message
    const data = JSON.parse(message);

    if (data.role === "user") {
      // Handle user messages
      messagingController.handleUserMessage(data.message);
    } else if (data.role === "agent") {
      // Handle agent messages
      messagingController.handleAgentMessage(data.message);
    }
  });
});

module.exports = router;
