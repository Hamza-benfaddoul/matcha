// const chatController = require("../controllers/chat/chatController");
// const notificationController = require("../controllers/chat/notificationController");
const verifyJWT = require("../middleware/verifyJWT");
const db =  require('../db/db');


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



// services/socketService.js
const socketServiceChat = (io) => {
    // Store online users with multiple connections
    // Map structure: userId -> Set of socket IDs
    const onlineUsers = new Map();
    
    // Reverse lookup: socket ID -> userId
    const socketToUser = new Map();
  
    io.use(verifyJWT);
  
    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id, socket.user?.email);
      
      // Extract userId from auth data
      const userId = socket.handshake.auth.userId;
      console.log(`Socket connection attempt with userId: ${userId}`);
      
      if (userId) {
        // Store user connection
        socketToUser.set(socket.id, userId);
        
        // Add this socket to the user's set of connections
        if (!onlineUsers.has(userId)) {
          onlineUsers.set(userId, new Set());
          // Broadcast user_online event to ALL clients EXCEPT the sender
          console.log(`Broadcasting user_online event for userId: ${userId}`);
          socket.broadcast.emit("user_online", userId);
        }
        onlineUsers.get(userId).add(socket.id);
        
        // Log current state
        console.log(`User ${userId} connected with socket ${socket.id}`);
        console.log(`Total online users: ${onlineUsers.size}`);
        console.log(`Online user IDs: ${Array.from(onlineUsers.keys())}`);
        
        // Send the current online users to the newly connected client
        const onlineUserIds = Array.from(onlineUsers.keys());
        console.log(`Sending online_users event to socket ${socket.id} with data:`, onlineUserIds);
        socket.emit("online_users", onlineUserIds);
        
        // Send initial status to the newly connected user about all other users
        onlineUserIds.forEach(onlineUserId => {
          if (onlineUserId !== userId) {
            console.log(`Sending user_online event to new user ${userId} for existing user ${onlineUserId}`);
            socket.emit("user_online", onlineUserId);
          }
        });
      }
    
    // In your socket.io connection handler
        socket.on("start_call", ({ callerId, receiverId }) => {
            console.log(`Start call from ${callerId} to ${receiverId}`);
            const recipientSocketIds = onlineUsers.get(receiverId);
            
            if (recipientSocketIds && recipientSocketIds.size > 0) {
            recipientSocketIds.forEach(socketId => {
                io.to(socketId).emit("incoming_call", {
                callerId,
                callerName: socket.user.name // or get from your user data
                });
            });
            }
        });
        
        socket.on("call_accepted", ({ callerId, receiverId }) => {
            const callerSocketIds = onlineUsers.get(callerId);
            
            if (callerSocketIds && callerSocketIds.size > 0) {
            callerSocketIds.forEach(socketId => {
                io.to(socketId).emit("call_accepted", {
                receiverId
                });
            });
            }
        });
        
        socket.on("call_rejected", ({ callerId }) => {
            const callerSocketIds = onlineUsers.get(callerId);
            
            if (callerSocketIds && callerSocketIds.size > 0) {
            callerSocketIds.forEach(socketId => {
                io.to(socketId).emit("call_rejected");
            });
            }
        });
        
        socket.on("end_call", ({ userId, otherUserId }) => {
            const otherUserSocketIds = onlineUsers.get(otherUserId);
            
            if (otherUserSocketIds && otherUserSocketIds.size > 0) {
            otherUserSocketIds.forEach(socketId => {
                io.to(socketId).emit("call_ended", {
                userId
                });
            });
            }
        });
        
        socket.on("webrtc_offer", (data) => {
            const { to, offer } = data;
            const recipientSocketIds = onlineUsers.get(to);
            
            if (recipientSocketIds && recipientSocketIds.size > 0) {
            recipientSocketIds.forEach(socketId => {
                io.to(socketId).emit("webrtc_offer", {
                from: socket.user.id,
                offer
                });
            });
            }
        });
        
        socket.on("webrtc_answer", (data) => {
            const { to, answer } = data;
            const recipientSocketIds = onlineUsers.get(to);
            
            if (recipientSocketIds && recipientSocketIds.size > 0) {
            recipientSocketIds.forEach(socketId => {
                io.to(socketId).emit("webrtc_answer", {
                from: socket.user.id,
                answer
                });
            });
            }
        });
        
        socket.on("webrtc_ice_candidate", (data) => {
            const { to, candidate } = data;
            const recipientSocketIds = onlineUsers.get(to);
            
            if (recipientSocketIds && recipientSocketIds.size > 0) {
            recipientSocketIds.forEach(socketId => {
                io.to(socketId).emit("webrtc_ice_candidate", {
                from: socket.user.id,
                candidate
                });
            });
            }
        });
      // Handle chat messages
      socket.on("send_message", (messageData) => {
        // console.log(`Received message from user ${userId}:`, messageData);
        // Save message to database here if needed
        // ...
        console.log(`Message data:`, messageData);
        // Save message to the database
        const saveMessageQuery = `
          INSERT INTO messages (sender_id, receiver_id, content, message_type, created_at)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;

        const messageValues = [
          userId,
          messageData.receiverId,
          messageData.content,
          messageData.type,
          messageData.timestamp,
        ];

        db.query(saveMessageQuery, messageValues)
          .then((result) => {
            console.log("Message saved to database:", result.rows[0]);
          })
          .catch((error) => {
            console.error("Error saving message to database:", error);
          });
        
        // Find all recipient's sockets if they're online
        const recipientSocketIds = onlineUsers.get(messageData.receiverId);
        if (recipientSocketIds && recipientSocketIds.size > 0) {
            console.log("recipientSocketIds: ", recipientSocketIds);
          // Send to all of recipient's connections
          recipientSocketIds.forEach(socketId => {
            io.to(socketId).emit("new_message", {
              ...messageData,
              senderId: userId,
              timestamp: new Date()
            });
          });
        }
        
        // Confirm message receipt to sender
        socket.emit("message_sent", {
          messageId: messageData.id,
          status: "sent",
          timestamp: new Date()
        });
      });
  
      // Handle typing indicators
      socket.on("typing", ({ recipientId, isTyping }) => {
        const recipientSocketIds = onlineUsers.get(recipientId);
        
        if (recipientSocketIds && recipientSocketIds.size > 0) {
          recipientSocketIds.forEach(socketId => {
            io.to(socketId).emit("user_typing", {
              userId,
              isTyping
            });
          });
        }
      });
  
      // Handle read receipts
      socket.on("message_read", ({ messageId, senderId }) => {
        const senderSocketIds = onlineUsers.get(senderId);
        
        if (senderSocketIds && senderSocketIds.size > 0) {
          senderSocketIds.forEach(socketId => {
            io.to(socketId).emit("message_status_update", {
              messageId,
              status: "read",
              timestamp: new Date()
            });
          });
        }
      });
  
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        
        // Use the reverse lookup to find which user this socket belonged to
        const disconnectedUserId = socketToUser.get(socket.id);
        console.log(`Disconnect event for socket ${socket.id}, associated with userId: ${disconnectedUserId}`);
        
        if (disconnectedUserId) {
          // Remove this socket from the user's set of connections
          const userSockets = onlineUsers.get(disconnectedUserId);
          
          if (userSockets) {
            // Remove this socket ID
            userSockets.delete(socket.id);
            console.log(`Removed socket ${socket.id} from user ${disconnectedUserId}'s connections`);
            console.log(`User ${disconnectedUserId} now has ${userSockets.size} active connections`);
            
            // If this was the user's last connection, remove them from online users
            if (userSockets.size === 0) {
              onlineUsers.delete(disconnectedUserId);
              // Broadcast offline status to ALL OTHER clients when all connections are gone
              console.log(`Broadcasting user_offline event for userId: ${disconnectedUserId}`);
              socket.broadcast.emit("user_offline", disconnectedUserId);
              console.log(`User ${disconnectedUserId} is now offline (no connections)`);
            }
          }
          
          // Clean up the reverse lookup
          socketToUser.delete(socket.id);
        }
      });
      
      // Debug event - can be used to check current state
      socket.on("get_online_status", () => {
        const onlineUserIds = Array.from(onlineUsers.keys());
        socket.emit("online_status_response", {
          onlineUsers: onlineUserIds,
          totalSockets: Array.from(socketToUser.keys()).length,
          yourId: socketToUser.get(socket.id)
        });
      });
    });
    
    // Log the current state every minute for debugging
    setInterval(() => {
      console.log("===== SOCKET SERVER STATUS =====");
      console.log(`Online users count: ${onlineUsers.size}`);
      console.log(`Total connected sockets: ${socketToUser.size}`);
      console.log("Online users:");
      onlineUsers.forEach((sockets, userId) => {
        console.log(`- User ${userId}: ${sockets.size} connections`);
      });
      console.log("================================");
    }, 60000); // Log every minute
  };



// const socketServiceChat = (io) => {
//   io.use(verifyJWT);
//   io.on("connection", (socket) => {
//     console.log("New client connected:", socket.id, socket.user?.email);
    

//     socket.on("disconnect", () => {
//     //   clearInterval(interval);
//       console.log("Client disconnected:", socket.id);
//     });
//   });
// };

module.exports = {
  socketServiceExample,
  socketServiceChat,
};
