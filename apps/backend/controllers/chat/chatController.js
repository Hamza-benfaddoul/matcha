const db =  require('../../db/db');

exports.getContacts = async (req, res) => {
    try {
        const userId = req.userId; // Assuming the user ID is available in the request object

        const contactsQuery = `
            SELECT 
            u.id,
            u.firstName AS firstname,
            u.lastName AS lastname,
            u.username,
            COALESCE(u.profile_picture, '/placeholder.svg?height=100&width=100') AS profile_picture,
            FALSE AS isOnline, -- Placeholder for isOnline since last_active column is missing
            (
                SELECT content 
                FROM messages 
                WHERE (sender_id = u.id AND receiver_id = $1) OR (sender_id = $1 AND receiver_id = u.id)
                ORDER BY created_at DESC 
                LIMIT 1
            ) AS lastMessage,
            (
                SELECT created_at 
                FROM messages 
                WHERE (sender_id = u.id AND receiver_id = $1) OR (sender_id = $1 AND receiver_id = u.id)
                ORDER BY created_at DESC 
                LIMIT 1
            ) AS lastMessageTime,
            (
                SELECT COUNT(*) 
                FROM messages 
                WHERE receiver_id = $1 AND sender_id = u.id AND is_read = FALSE
            ) AS unreadCount
            FROM users u
            WHERE u.id != $1
            AND EXISTS (
            SELECT 1 
            FROM messages 
            WHERE (sender_id = u.id AND receiver_id = $1) OR (sender_id = $1 AND receiver_id = u.id)
            )
            ORDER BY lastMessageTime DESC NULLS LAST;
        `;

        const contacts = await db.query(contactsQuery, [userId]);
        res.status(200).json(contacts.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching contacts.' });
    }
}


exports.getMessages = async (req, res) => {
    try {
        const { userId, contactId } = req.query;

        const messagesQuery = `
            SELECT 
                m.id,
                m.sender_id AS senderId,
                m.receiver_id AS receiverId,
                m.content,
                m.message_type AS messageType,
                m.created_at AS timestamp
            FROM messages m
            WHERE (m.sender_id = $1 AND m.receiver_id = $2) OR (m.sender_id = $2 AND m.receiver_id = $1)
            ORDER BY m.created_at ASC;
        `;

        const messages = await db.query(messagesQuery, [userId, contactId]);

        const formattedMessages = messages.rows.map(message => ({
            id: message.id,
            senderId: message.senderid,
            receiverId: message.receiverid,
            content: message.content,
            timestamp: message.timestamp,
            type: message.messagetype
        }));

        res.status(200).json(formattedMessages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching messages.' });
    }
}