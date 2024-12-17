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
});


router.get('/:id',async (req, res) => {
  console.log("user id param:   ", req.params.id)
  const userId = req.params.id;
  const user = await findOne(userId)
  if(!user)
  {
    // 404 Not found
    console.log("User not found")
    res.status(404).send('The user with the given ID was not found!')
  }
  res.send(user);
});


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




module.exports = router;
