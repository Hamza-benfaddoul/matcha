const db =  require('../../db/db');
const { sendNotification } = require('../../services/notificationHelper');



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

const calculateFameRating = (views, likes) => {
  return (likes * 5) + (views * 1); // you can tune 5 and 1 later
}


exports.addLikeProfile = async (req, res) => {
    const likerId = req.userId;
    const { likedId } = req.body; // Profile being liked
    const notificationNamespace = req.app.get('notificationNamespace');

    // Fetch the number of views and likes for the likedId
    const viewsResult = await db.query('SELECT COUNT(*) AS views FROM views WHERE viewed_id = $1', [likedId]);
    const likesResult = await db.query('SELECT COUNT(*) AS likes FROM likes WHERE liked_id = $1', [likedId]);

    const views = parseInt(viewsResult.rows[0].views, 10);
    const likes = parseInt(likesResult.rows[0].likes, 10) + 1;

    try {
      // Record the like in the database
      const existingLike = await db.query('SELECT * FROM likes WHERE liker_id = $1 AND liked_id = $2', [likedId, likerId]);
      await db.query('INSERT INTO likes (liker_id, liked_id) VALUES ($1, $2)', [likerId, likedId]);

  
      // Update fame rating (calculateFameRating is called)
      const fameRating = calculateFameRating(views, likes);
      // Update the fame rating in the database
      await db.query('UPDATE users SET fame_rating = $1 WHERE id = $2', [fameRating, likedId]);
      if (existingLike.rows.length > 0) {
        await sendNotification(notificationNamespace, likedId, {
          type: 'Like',
          title: 'You have a new like',
          message: `User that you like also has liked your profile`,
          metadata: {
            likerId: likerId,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        await sendNotification(notificationNamespace, likedId, {
          type: 'Like',
          title: 'You have a new like',
          message: `User has liked your profile`,
          metadata: {
            likerId: likerId,
            timestamp: new Date().toISOString()
          }
        });
      }
      // res.status(200).json({ message: 'Profile liked successfully', fameRating });
      res.status(200).json({ message: 'Profile liked successfully' });
    } catch (error) {
      console.error('Error liking profile:', error);
      res.status(500).json({ message: 'Error liking profile' });
    }
}

exports.isLiked = async (req, res) => {
  const likerId = req.userId;
  const likedId = req.query.likedId; // Profile being liked
    try {
      // Record the like in the database
      const existingLike = await db.query('SELECT * FROM likes WHERE liker_id = $1 AND liked_id = $2', [likerId, likedId]);
      let isLikedVar = false;
      if (existingLike.rows.length > 0) {
        isLikedVar = true;
      }
      return res.status(200).json({ message: 'You have already liked this profile', isLiked: isLikedVar });

    } catch (error) {
      console.error('Error liking profile:', error);
      res.status(500).json({ message: 'Error liking profile' });
    }
}



exports.removeLikeProfile = async (req, res) => {
    const likerId = req.userId;
    const { likedId } = req.body; // Profile being liked
    const notificationNamespace = req.app.get('notificationNamespace');


    console.log("likerid and likedid: ", likerId, likedId);
    try {
      // Remove the like
      const result = await db.query(`
        SELECT * 
        FROM likes 
        WHERE (liker_id = $1 AND liked_id = $2)
        AND EXISTS (
          SELECT 1 
          FROM likes 
          WHERE liker_id = $2 AND liked_id = $1
        )
      `, [likerId, likedId]);
      if (result.rows.length > 0) {
          await sendNotification(notificationNamespace, likedId, {
            type: 'Unlike',
            title: 'User has unliked your profile',
            message: `A user who you were connected with has unliked you`,
            metadata: {
                likerId: likerId,
                timestamp: new Date().toISOString()
            }
        });
      }
      await db.query('DELETE FROM likes WHERE liker_id = $1 AND liked_id = $2', [likerId, likedId]);
      // Optionally, you can also remove the like from the likes table
      
      res.status(200).json({ message: 'Profile unliked' });
      // res.status(200).json({ message: 'Profile unliked', fameRating });
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

exports.isConnected = async (req, res) => {
  const userId = req.userId;
  const likedId = req.params.likedId; // Profile being liked

  console.log("userId and likedId in connected controller: ", userId, likedId);
  try {
    // Check if the user is connected to the liked profile
    const result = await db.query(`
      SELECT * 
      FROM likes 
      WHERE (liker_id = $1 AND liked_id = $2)
      AND EXISTS (
        SELECT 1 
        FROM likes 
        WHERE liker_id = $2 AND liked_id = $1
      )
    `, [userId, likedId]);
    let isConnectedVar = false;
    if (result.rows.length > 0) {
      isConnectedVar = true;
    }
    return res.status(200).json({ message: 'You are connected to this profile', isConnected: isConnectedVar });

  } catch (error) {
    console.error('Error checking connection:', error);
    res.status(500).json({ message: 'Error checking connection' });
  }
}