require("dotenv");
const { io } = require("socket.io-client");

const socket = io(process.env.SOCKET_SERVER_URL, {
  auth: {
    serviceKey: process.env.SOCKET_SERVICE_KEY,
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

socket.on("connect", () => {
  console.log("✅ Connected to Socket Server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from Socket Server");
});

module.exports = socket;
