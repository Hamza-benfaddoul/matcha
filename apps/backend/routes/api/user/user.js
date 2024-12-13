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

// Route to complete user profile
router.post('/profile/complete', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const profileData = req.body;
  // const { name, age, bio } = profileData;
  try {
    const updatedUser = await updateProfile(userId, profileData);
    if (updatedUser) {
      res.status(200).json({ message: 'Profile completed successfully', user: updatedUser });
    } else {
      res.status(400).json({ error: 'Profile completion failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
})

// Update user profile
router.post('/update-profile', verifyToken, async (req, res) => {
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
router.post('/profile/photos', verifyToken, upload.array('photos', 5), async (req, res) => {
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
router.patch('/profile/photos/:photoId/profile-picture', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const photoId = req.params.photoId;

  const success = await setProfilePicture(userId, photoId);
  if (success) {
    res.status(200).json({ message: 'Profile picture set successfully' });
  } else {
    res.status(400).json({ error: 'Failed to set profile picture' });
  }
});



module.exports = router;
