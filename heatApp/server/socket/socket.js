// Set up a real-time WebSocket server (using Socket.IO) for a chat system and online/offline status

const http = require("http");
const { Server } = require("socket.io");
const express = require("express");

// Creates an express app and HTTP server, configure cors for Socket.IO
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow all origins for simplicity; adjust as needed for security
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

// helpsl find a specific user's socket ID for sending targeted messages
const getReceiverSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

// keeps track of which users are online with their socket IDs
const userSocketMap = {}; // userId: socketId

// Connection handling
io.on("connection", (socket) => {
  // logs the connection with the user's socket ID
  console.log("A user connected:", socket.id);

  // extracts userId from the connection query parameters
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") {
    // maps user to their socket ID
    userSocketMap[userId] = socket.id;
  }
  // broadcasts the list of online users to
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // disconnection handling
  socket.on("disconnect", () => {
    // logs the disconnection
    console.log("A user disconnected:", socket.id);
    // removes the user from the online users map
    delete userSocketMap[userId];
    // broadcasts the updated list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { io, server, app, getReceiverSocketId };
