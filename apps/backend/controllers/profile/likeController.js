const db =  require('../../db/db');

exports.getLikesProfile = async (req, res) => {
    const userId = req.params.id;

    try {
      // Get a list of users who liked the current user's profile
      const result = await db.query(`
        SELECT users.id, users.firstName, users.lastName, profile_picture, gender, sexual_preferences, likes.liked_at
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
}

exports.addLikeProfile = async (req, res) => {
    const likerId = req.userId;
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
}

exports.removeLikeProfile = async (req, res) => {
    const likerId = req.userId;
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
}

exports.countLikes = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const result = await db.query('SELECT COUNT(*) FROM likes WHERE liked_id = $1', [userId]);
      const likesCount = result.rows[0].count;
      
      res.status(200).json({ likesCount });
    } catch (error) {
      console.error('Error counting profile likes:', error);
      res.status(500).json({ message: 'Error counting profile likes' });
    }
}