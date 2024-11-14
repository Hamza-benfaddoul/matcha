const express = require('express')
const router = express.Router();

// Middleware to verify JWT
const verifyToken = require('../../../middleware/authMiddleware');


// Route: POST /api/user/tags
app.post('/api/user/tags', verifyToken, async (req, res) => {
    const userId = req.user.userId;
    const { tags } = req.body; // Array of tag names
  
    try {
      // Insert new tags or get existing tags from the database
      const tagPromises = tags.map(async (tagName) => {
        let tagRes = await db.query('SELECT * FROM tags WHERE name = $1', [tagName]);
  
        // If the tag doesn't exist, insert it
        if (tagRes.rows.length === 0) {
          tagRes = await db.query('INSERT INTO tags (name) VALUES ($1) RETURNING id', [tagName]);
        }
  
        // Add the tag to the user_tags table
        await db.query('INSERT INTO user_tags (user_id, tag_id) VALUES ($1, $2)', [userId, tagRes.rows[0].id]);
      });
  
      // Wait for all tag insertions to complete
      await Promise.all(tagPromises);
  
      res.status(200).json({ message: 'Tags updated successfully' });
    } catch (error) {
      console.error('Error updating tags:', error);
      res.status(500).json({ message: 'Error updating tags' });
    }
  });

  // Route: GET /api/user/tags
app.get('/api/user/tags', verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    // Get tags associated with the user
    const result = await db.query(`
      SELECT t.name
      FROM tags t
      JOIN user_tags ut ON t.id = ut.tag_id
      WHERE ut.user_id = $1
    `, [userId]);

    res.status(200).json({ tags: result.rows });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Error fetching tags' });
  }
});

module.exports = router;

  