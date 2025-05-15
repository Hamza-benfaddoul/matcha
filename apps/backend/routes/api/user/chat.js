
const express = require('express');
const getContacts = require('../../../controllers/chat/chatController').getContacts;
const getMessages = require('../../../controllers/chat/chatController').getMessages;
const db =  require('../../../db/db');
// In your Express server (e.g., /api/chat/upload-audio)
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.post('/remove', (req, res) => removeBlock(req, res));
router.get('/get-contact', (req, res) => getContacts(req, res));
router.get('/get-messages', (req, res) => getMessages(req, res));


// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, '../../../uploads/audio/');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'audio-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  
const upload = multer({ storage: storage });
  
router.post('/upload-audio', upload.single('audio'), async (req, res) => {
    console.log('Received audio file:', req.file);
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No audio file uploaded' });
      }
  
      const { senderId, receiverId } = req.body;
      
      // Construct the URL where the file can be accessed
      const audioUrl = `/uploads/audio/${req.file.filename}`;
    //   await db.query(
    //       `
    //       INSERT INTO messages (sender_id, receiver_id, content, message_type, created_at)
    //       VALUES ($1, $2, $3, $4, NOW())
    //       `,
    //       [senderId, receiverId, audioUrl, 'audio']
    //   );
  
      res.json({ 
        success: true,
        audioUrl: audioUrl
      });
    } catch (error) {
      console.error('Error handling audio upload:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;

