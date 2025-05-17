const db = require('../db/db');


// Get unread count for a user
async function getUnreadCount(userId) {
    const query = `
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = $1 AND is_read = false
    `;
    
    const result = await db.query(query, [userId]);
    return parseInt(result.rows[0].count, 10);
}
  
  // Get notification by ID
async function getNotificationById(notificationId, userId) {
    const query = `
      SELECT *
      FROM notifications
      WHERE id = $1 AND user_id = $2
    `;
    
    const result = await db.query(query, [notificationId, userId]);
    return result.rows[0];
  }


// services/socketNotificationService.js
const socketNotificationService = (io) => {
    io.on("connection", (socket) => {
        console.log(`New notification client connected: ${socket.id}`);
        const userId = socket.handshake.auth.userId;
        
        // Join user-specific room for targeted notifications
        socket.join(`user-${userId}`);
        
      // Load user's notifications on connection
      socket.on("get_notifications", async (data = { limit: 20, offset: 0 }) => {
        try {
          const notifications = await fetchUserNotifications(userId, data.limit, data.offset);
          const unreadCount = await getUnreadCount(userId);
          
          socket.emit("initial_notifications", {
            notifications,
            unreadCount,
            hasMore: notifications.length >= data.limit
          });
        } catch (error) {
          console.error("Error fetching notifications:", error);
          socket.emit("notification_error", { message: "Failed to load notifications" });
        }
      });
  
      // Handle mark as read
      socket.on("mark_as_read", async (notificationId) => {
        await markNotificationAsRead(notificationId, userId);
      });
  
      // Handle mark all as read
      socket.on("mark_all_as_read", async () => {
        await markAllNotificationsAsRead(userId);
      });
  
      // Handle clear notifications
      socket.on("clear_notifications", async () => {
        await clearUserNotifications(userId);
      });
  
      socket.on("disconnect", () => {
        console.log(`Notification client disconnected: ${socket.id}`);
      });

       // Add handler for fetching unread count
       socket.on("get_unread_count", async () => {
        try {
          const count = await getUnreadCount(userId);
          socket.emit("unread_count", count);
        } catch (error) {
          console.error("Error getting unread count:", error);
        }
      });
      
    });
    
    
    const sendNotificationToUser = async (userId, notificationData) => {
        try {
        //   const notification = await createNotification(
        //     userId,
        //     notificationData.type,
        //     notificationData.title,
        //     notificationData.message,
        //     notificationData.metadata
        //   );
          
          io.to(`user-${userId}`).emit("new_notification", notification);
          return notification;
        } catch (error) {
          console.error("Error sending notification:", error);
          throw error;
        }
      };
  
    return {
      sendNotificationToUser
    };
  };
  



// Fetch user notifications with pagination
async function fetchUserNotifications(userId, limit , offset) {
    console.log("Fetching notifications for userId =======> :", userId);
  const query = `
    SELECT 
      id, 
      type, 
      title, 
      message, 
      is_read as "isRead", 
      metadata, 
      created_at as "createdAt",
      expires_at as "expiresAt"
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;
  
  const result = await db.query(query, [userId, limit, offset]);
  return result.rows;
}

// Mark single notification as read
async function markNotificationAsRead(notificationId, userId) {
  const query = `
    UPDATE notifications
    SET is_read = true, 
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND user_id = $2
    RETURNING id, is_read as "isRead"
  `;
  
  const result = await db.query(query, [notificationId, userId]);
  return result.rows[0];
}

// Mark all notifications as read for a user
async function markAllNotificationsAsRead(userId) {
  const updateQuery = `
    UPDATE notifications
    SET is_read = true,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $1 AND is_read = false
  `;
  
  const countQuery = `
    SELECT COUNT(*) as updated_count
    FROM notifications
    WHERE user_id = $1 AND is_read = true
  `;
  
  await db.query(updateQuery, [userId]);
  const countResult = await db.query(countQuery, [userId]);
  return parseInt(countResult.rows[0].updated_count, 10);
}

// Clear all notifications for a user
async function clearUserNotifications(userId) {
  const query = `
    DELETE FROM notifications
    WHERE user_id = $1
    RETURNING COUNT(*) as deleted_count
  `;
  
  const result = await db.query(query, [userId]);
  return result.rows[0].deleted_count;
}

// Create a new notification
async function createNotification(
    userId,
    type,
    title,
    message,
    metadata = {}
  ) {
    const query = `
      INSERT INTO notifications (
        user_id, 
        type, 
        title, 
        message, 
        metadata
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING 
        id,
        user_id as "userId",
        type,
        title,
        message,
        is_read as "isRead",
        created_at as "createdAt",
        metadata
    `;
    
    const result = await db.query(query, [
      userId,
      type,
      title,
      message,
      JSON.stringify(metadata) // Ensure metadata is properly stringified
    ]);
    
    return result.rows[0];
  }


module.exports = {
    socketNotificationService,
};