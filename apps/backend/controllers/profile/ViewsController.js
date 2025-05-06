const db =  require('../../db/db');
const { sendNotification } = require('../../services/notificationHelper');

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
    const notificationNamespace = req.app.get('notificationNamespace');

  
  try {
    // Check if a view already exists
    const existingView = await db.query(`
      SELECT viewed_at 
      FROM views 
      WHERE viewer_id = $1 AND viewed_id = $2
    `, [viewerId, viewedId]);

    if (existingView.rows.length > 0) {
      const lastViewedAt = new Date(existingView.rows[0].viewed_at);
      const now = new Date();

      // Check if one day has passed
      const oneDayInMs = 24 * 60 * 60 * 1000;
      if (now - lastViewedAt < oneDayInMs) {
        return res.status(200).json({ message: 'View already exists and is less than one day old' });
      }
    }

    // Insert a new view
    await db.query(`
      INSERT INTO views (viewer_id, viewed_id) 
      VALUES ($1, $2)
    `, [viewerId, viewedId]);

    await sendNotification(notificationNamespace, viewedId, {
      type: 'View Profile',
      title: 'You have a new profile view',
      message: `User has viewed your profile`,
      metadata: {
          viewerId: viewerId,
          timestamp: new Date().toISOString()
      }
  });

    res.status(201).json({ message: 'View added successfully' });
  } catch (error) {
    console.error('Error adding profile view:', error);
    res.status(500).json({ message: 'Error adding profile view' });
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