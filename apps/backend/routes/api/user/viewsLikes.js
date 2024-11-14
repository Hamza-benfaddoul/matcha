const express = require('express')
const router = express.Router();

// Middleware to verify JWT
const verifyToken = require('../../../middleware/authMiddleware');



const calculateFameRating = async (userId) => {
  try {
    const likesCount = await db.query('SELECT COUNT(*) FROM likes WHERE liked_id = $1', [userId]);
    const viewsCount = await db.query('SELECT COUNT(*) FROM views WHERE viewed_id = $1', [userId]);
    const fameRating = likesCount.rows[0].count * 2 + viewsCount.rows[0].count;

    // Update the fame rating in the user record
    await db.query('UPDATE users SET fame_rating = $1 WHERE id = $2', [fameRating, userId]);

    return fameRating;
  } catch (error) {
    console.error('ERROR: CALCULATE FAME RATING\n', error);
    return null;
  }
};


// Route: POST /api/user/view
app.post('/api/user/view', verifyToken, async (req, res) => {
    const viewerId = req.user.userId;
    const { viewedId } = req.body; // Profile being viewed
  
    try {
      // Record the view in the database
      await db.query('INSERT INTO views (viewer_id, viewed_id) VALUES ($1, $2)', [viewerId, viewedId]);
  
      // Update fame rating (calculateFameRating is called)
      const fameRating = await calculateFameRating(viewedId);
  
      res.status(200).json({ message: 'Profile viewed successfully', fameRating });
    } catch (error) {
      console.error('Error viewing profile:', error);
      res.status(500).json({ message: 'Error viewing profile' });
    }
  });

  
  // Route: POST /api/user/like
app.post('/api/user/like', verifyToken, async (req, res) => {
    const likerId = req.user.userId;
    const { likedId } = req.body; // Profile being liked
  
    try {
      // Record the like in the database
      await db.query('INSERT INTO likes (liker_id, liked_id) VALUES ($1, $2)', [likerId, likedId]);
  
      // Update fame rating (calculateFameRating is called)
      const fameRating = await calculateFameRating(likedId);
  
      res.status(200).json({ message: 'Profile liked successfully', fameRating });
    } catch (error) {
      console.error('Error liking profile:', error);
      res.status(500).json({ message: 'Error liking profile' });
    }
  });


  // Route to unlike a user profile
router.post('/api/user/unlike', verifyToken, async (req, res) => {
  const likerId = req.user.id;
  const { likedId } = req.body; // ID of the profile being unliked

  try {
    // Remove the like
    await db.query('DELETE FROM likes WHERE liker_id = $1 AND liked_id = $2', [likerId, likedId]);

    // Recalculate fame rating
    const fameRating = await calculateFameRating(likedId);

    res.status(200).json({ message: 'Profile unliked', fameRating });
  } catch (error) {
    console.error('Error unliking profile:', error);
    res.status(500).json({ message: 'Error unliking profile' });
  }
});
  
  // Route: GET /api/user/views
app.get('/api/user/views', verifyToken, async (req, res) => {
    const userId = req.user.userId;
  
    try {
      // Get a list of users who viewed the current user's profile
      const result = await db.query(`
        SELECT users.id, users.firstName, users.lastName, views.viewed_at
        FROM views
        JOIN users ON views.viewer_id = users.id
        WHERE views.viewed_id = $1
        ORDER BY views.viewed_at DESC
      `, [userId]);
  
      res.status(200).json({ views: result.rows });
    } catch (error) {
      console.error('Error fetching profile views:', error);
      res.status(500).json({ message: 'Error fetching profile views' });
    }
  });

  
  // Route: GET /api/user/likes
app.get('/api/user/likes', verifyToken, async (req, res) => {
    const userId = req.user.userId;
  
    try {
      // Get a list of users who liked the current user's profile
      const result = await db.query(`
        SELECT users.id, users.firstName, users.lastName, likes.liked_at
        FROM likes
        JOIN users ON likes.liker_id = users.id
        WHERE likes.liked_id = $1
        ORDER BY likes.liked_at DESC
      `, [userId]);
  
      res.status(200).json({ likes: result.rows });
    } catch (error) {
      console.error('Error fetching profile likes:', error);
      res.status(500).json({ message: 'Error fetching profile likes' });
    }
  });

  module.exports = router;
