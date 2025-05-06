const verifyJWT = require("../middleware/verifyJWT");
const db = require('../db/db');

const socketOnlineService = (io) => {
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

      // Update the last_login timestamp for the user in the database
      if (userId) {
          const updateLastLoginQuery = `
              UPDATE users
              SET last_login = CURRENT_TIMESTAMP
              WHERE id = $1
          `;
          db.query(updateLastLoginQuery, [userId])
              .then(() => {
                  console.log(`Updated last_login for userId: ${userId}`);
              })
              .catch((err) => {
                  console.error(`Error updating last_login for userId: ${userId}`, err);
              });
      }
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
        socket.emit("online_users", onlineUserIds);
        
        // Send initial status to the newly connected user about all other users
        onlineUserIds.forEach(onlineUserId => {
          if (onlineUserId !== userId) {
            socket.emit("user_online", onlineUserId);
          }
        });
      }

      // NEW: Handle user reconnect events
      socket.on("user_reconnect", (data) => {
        const reconnectUserId = data.userId;
        const currentUserId = socketToUser.get(socket.id);
        
        console.log(`User reconnect event: ${reconnectUserId} (current socket user: ${currentUserId})`);
        
        // If the user ID changed (this would be unusual but let's handle it)
        if (currentUserId && currentUserId !== reconnectUserId) {
          // Remove this socket from the old user's connections
          if (onlineUsers.has(currentUserId)) {
            onlineUsers.get(currentUserId).delete(socket.id);
            
            // If that was the user's last connection, they're now offline
            if (onlineUsers.get(currentUserId).size === 0) {
              onlineUsers.delete(currentUserId);
              socket.broadcast.emit("user_offline", currentUserId);
              console.log(`User ${currentUserId} is now offline (no connections after reconnect)`);
            }
          }
          
          // Update the socket-to-user mapping
          socketToUser.set(socket.id, reconnectUserId);
          
          // Add to the reconnected user's connections
          if (!onlineUsers.has(reconnectUserId)) {
            onlineUsers.set(reconnectUserId, new Set());
            socket.broadcast.emit("user_online", reconnectUserId);
          }
          onlineUsers.get(reconnectUserId).add(socket.id);
          
          console.log(`User ${reconnectUserId} reconnected with socket ${socket.id}`);
        }
        
        // If the client is asking for the latest online status after reconnection
        socket.emit("online_users", Array.from(onlineUsers.keys()));
      });
  
      // Handle get_online_status with callback (as used in your OnlineStatusContext)
      socket.on("get_online_status", (_, callback) => {
        if (typeof callback === 'function') {
          callback({
            onlineUsers: Array.from(onlineUsers.keys())
          });
        } else {
          // Fallback to emit for older implementation
          socket.emit("online_status_response", {
            onlineUsers: Array.from(onlineUsers.keys()),
            totalSockets: Array.from(socketToUser.keys()).length,
            yourId: socketToUser.get(socket.id)
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
    });
    
    // Log the current state every minute for debugging
    // setInterval(() => {
    //   console.log("===== SOCKET SERVER STATUS =====");
    //   console.log(`Online users count: ${onlineUsers.size}`);
    //   console.log(`Total connected sockets: ${socketToUser.size}`);
    //   console.log("Online users:");
    //   onlineUsers.forEach((sockets, userId) => {
    //     console.log(`- User ${userId}: ${sockets.size} connections`);
    //   });
    //   console.log("================================");
    // }, 60000); // Log every minute
  };

module.exports = {
    socketOnlineService,
};

