// const chatController = require("../controllers/chat/chatController");
// const notificationController = require("../controllers/chat/notificationController");
const verifyJWT = require("../middleware/verifyJWT");

const socketServiceExample = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join user to their own room for private messages
    socket.on("join-user-room", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Chat handlers
    socket.on("send-message", (data) =>
      chatController.handleSendMessage(io, socket, data),
    );
    socket.on("typing", (data) =>
      chatController.handleTyping(io, socket, data),
    );

    // Notification handlers
    socket.on("like-notification", (data) =>
      notificationController.handleLikeNotification(io, socket, data),
    );
    socket.on("view-notification", (data) =>
      notificationController.handleViewNotification(io, socket, data),
    );

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

// services/socketServiceExample.js
const testConnection = (io) => {
  io.use(verifyJWT);
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id, socket.user?.email);

    // Test connection handler
    socket.on("test-connection", (data) => {
      console.log("Test connection data:", data);

      // Send response only to the sender
      socket.emit("test-connection-response", {
        message: `Test successful at ${new Date().toISOString()}`,
        user: socket.user?.email,
      });
    });

    // Heartbeat system
    const interval = setInterval(() => {
      if (socket.connected) {
        socket.emit("heartbeat");
      }
    }, 30000);

    socket.on("disconnect", () => {
      clearInterval(interval);
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = {
  socketServiceExample,
  testConnection,
};
