const db = require('../db/db');

module.exports = {
    sendNotification: async (namespace, userId, notificationData) => {
        try {
            // Save to database
            const query = `
                INSERT INTO notifications (
                    user_id, 
                    type, 
                    title, 
                    message, 
                    metadata
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;
            
            const result = await db.query(query, [
                userId,
                notificationData.type,
                notificationData.title,
                notificationData.message,
                JSON.stringify(notificationData.metadata || {})
            ]);
            
            const notification = result.rows[0];
            
            // Send via socket
            namespace.to(`user-${userId}`).emit('new_notification', notification);
            
            return notification;
        } catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    }
};