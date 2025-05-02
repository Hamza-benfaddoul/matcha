const express = require('express')
const router = express.Router();

// Middleware to verify JWT
const verifyToken = require('../../../middleware/authMiddleware');


// Route: POST /api/user/location
app.post('/api/user/location', verifyToken, async (req, res) => {
    const userId = req.user.userId;
    const { latitude, longitude } = req.body;
  
    try {
      // Update the user's location in the database
      const result = await db.query('UPDATE users SET location = point($1, $2) WHERE id = $3 RETURNING location', [longitude, latitude, userId]);
  
      res.status(200).json({ message: 'Location updated successfully', location: result.rows[0].location });
    } catch (error) {
      console.error('Error updating location:', error);
      res.status(500).json({ message: 'Error updating location' });
    }
  });
  
module.exports = router;