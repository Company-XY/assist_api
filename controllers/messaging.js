const io = require("socket.io")();

const userSockets = [];
const agentSockets = [];

io.on("connection", (socket) => {
  socket.on("join", (role) => {
    if (role === "user") {
      userSockets.push(socket);
    } else if (role === "agent") {
      agentSockets.push(socket);
    }
  });

  socket.on("userMessage", (message) => {
    agentSockets.forEach((agentSocket) => {
      agentSocket.emit("agentMessage", message);
    });
  });

  socket.on("agentMessage", (message) => {
    userSockets.forEach((userSocket) => {
      userSocket.emit("userMessage", message);
    });
  });

  socket.on("disconnect", () => {
    const index = userSockets.indexOf(socket);
    if (index !== -1) {
      userSockets.splice(index, 1);
    } else {
      const agentIndex = agentSockets.indexOf(socket);
      if (agentIndex !== -1) {
        agentSockets.splice(agentIndex, 1);
      }
    }
  });
});

module.exports = io;
