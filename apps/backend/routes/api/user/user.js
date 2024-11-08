const express = require('express')
const router = express.Router();
// Middleware to verify JWT
const verifyToken = require('../../../middleware/authMiddleware');
const { findAll, findOne, updateProfile } = require('../../../models/users');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: path.join(__dirname, '../uploads') }); // Adjust path as needed


router.get('/', async (req, res) => {
  const users = await findAll();
  if(!users)
    res.send("Users not found")
  else
    res.send(users);
})

router.get('/:userId',async (req, res) => {
  const { userId } = req.params;
  const user = await findOne(userId)
  if(!user)
  {
    // 404 Not found
    res.status(404).send('The user with the given ID was not found!')
  }
  res.send(user);
});


// Update user profile
router.patch('/profile', verifyToken, async (req, res) => {
  const userId = req.user.userId; // Get user ID from JWT token
  const profileData = req.body; // Get profile data from request body

  try {
    const updatedUser = await updateProfile(userId, profileData);
    if (updatedUser) {
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } else {
      res.status(400).json({ error: 'Profile update failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to upload photos
router.post('/profile/photos', authenticate, upload.array('photos', 5), async (req, res) => {
  const userId = req.user.userId;
  const photos = req.files.map(file => ({
    user_id: userId,
    file_path: file.path,
    is_profile_picture: false
  }));

  try {
    for (const photo of photos) {
      await db.query(
        'INSERT INTO photos (user_id, file_path, is_profile_picture) VALUES ($1, $2, $3)',
        [photo.user_id, photo.file_path, photo.is_profile_picture]
      );
    }
    res.status(200).json({ message: 'Photos uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload photos' });
  }
});



const setProfilePicture = async (userId, photoId) => {
  try {
    // Set all photos to non-profile
    await db.query('UPDATE photos SET is_profile_picture = FALSE WHERE user_id = $1', [userId]);

    // Set the selected photo as profile picture
    await db.query('UPDATE photos SET is_profile_picture = TRUE WHERE id = $1 AND user_id = $2', [photoId, userId]);

    return true;
  } catch (err) {
    console.error('ERROR: SET PROFILE PICTURE\n', err);
    return false;
  }
};

// Route to set profile picture
router.patch('/profile/photos/:photoId/profile-picture', authenticate, async (req, res) => {
  const userId = req.user.userId;
  const photoId = req.params.photoId;

  const success = await setProfilePicture(userId, photoId);
  if (success) {
    res.status(200).json({ message: 'Profile picture set successfully' });
  } else {
    res.status(400).json({ error: 'Failed to set profile picture' });
  }
});


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

// Route to view a user profile
app.post('/api/user/view', verifyToken, async (req, res) => {
  const viewerId = req.user.id;
  const { viewedId } = req.body; // ID of the profile being viewed

  try {
    // Record the view
    await db.query('INSERT INTO views (viewer_id, viewed_id) VALUES ($1, $2)', [viewerId, viewedId]);

    // Recalculate fame rating
    const fameRating = await calculateFameRating(viewedId);

    res.status(200).json({ message: 'Profile viewed', fameRating });
  } catch (error) {
    console.error('Error viewing profile:', error);
    res.status(500).json({ message: 'Error viewing profile' });
  }
});

// Route to like a user profile
app.post('/api/user/like', verifyToken, async (req, res) => {
  const likerId = req.user.id;
  const { likedId } = req.body; // ID of the profile being liked

  try {
    // Record the like
    await db.query('INSERT INTO likes (liker_id, liked_id) VALUES ($1, $2)', [likerId, likedId]);

    // Recalculate fame rating
    const fameRating = await calculateFameRating(likedId);

    res.status(200).json({ message: 'Profile liked', fameRating });
  } catch (error) {
    console.error('Error liking profile:', error);
    res.status(500).json({ message: 'Error liking profile' });
  }
});

// Route to unlike a user profile
app.post('/api/user/unlike', verifyToken, async (req, res) => {
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


module.exports = router;
