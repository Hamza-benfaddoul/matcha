const express = require('express')
const router = express.Router();
const geoip = require('geoip-lite');
const db =  require('../../../db/db');

(async () => {
  const publicIp = await import('public-ip');
})();

// Middleware to verify JWT
const verifyToken = require('../../../middleware/authMiddleware');


// Route: POST /api/user/location
router.put('/update', async (req, res) => {
    const userId = req.body.userId;
    const { latitude, longitude } = req.body;
  
    try {
      // Update the user's location in the database
      const result = await db.query(
        'UPDATE users SET location_latitude = $1, location_longitude = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING location_latitude, location_longitude',
        [latitude, longitude, userId]
      );
      
      res.status(200).json({ message: 'Location updated successfully', location: result.rows[0].location });
    } catch (error) {
      console.error('Error updating location:', error);
      res.status(500).json({ message: 'Error updating location' });
    }
});

// Endpoint for approximate location
router.get('/approximate', async (req, res) => {
  try {
    // Get client's public IP (this might be behind proxy in production)
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // For local testing, you might need to use a public IP
    const ipToCheck = clientIp === '127.0.0.1' ? await publicIp.v4() : clientIp;
    
    // Look up location
    const geo = geoip.lookup(ipToCheck);
    
    if (geo) {
      res.json({
        latitude: geo.ll[0],
        longitude: geo.ll[1],
        accuracy: 'low',
        city: geo.city,
        region: geo.region
      });
    } else {
      // Default fallback location if IP lookup fails
      res.json({
        latitude: 33.5731,  // Default to Casablanca, Morocco
        longitude: -7.5898,
        accuracy: 'unknown',
        source: 'default'
      });
    }
  } catch (error) {
    console.error("Error in approximate location:", error);
    // Return a default location
    res.json({
      latitude: 33.5731,  // Default to Casablanca, Morocco
      longitude: -7.5898,
      accuracy: 'unknown',
      source: 'default'
    });
  }
});
  
module.exports = router;