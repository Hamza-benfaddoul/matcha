const db =  require('../../db/db');

exports.getViewsProfile = async (req, res) => {
  const userId = req.params.id;
  console.log('userId inside view profile controller: ', userId);
  
    try {
      // Get a list of users who viewed the current user's profile
      const result = await db.query(`
        SELECT users.id, users.firstName, users.lastName, profile_picture, gender, sexual_preferences, views.viewed_at
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
}

exports.addViewProfile = async (req, res) => {
    const viewerId = req.userId;
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
}

exports.countViews = async (req, res) => {
  const userId = req.params.id;

    try {
      const result = await db.query('SELECT COUNT(*) FROM views WHERE viewed_id = $1', [userId]);
      const viewsCount = result.rows[0].count;
      
      res.status(200).json({ viewsCount });
    } catch (error) {
      console.error('Error counting profile views:', error);
      res.status(500).json({ message: 'Error counting profile views' });
    }
}