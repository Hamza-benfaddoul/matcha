const express = require('express')
const router = express.Router();
// Middleware to verify JWT
const verifyToken = require('../../../middleware/authMiddleware');
const { findAll, findOne, updateProfile } = require('../../../models/users');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: path.join('./uploads') }); // Adjust path as needed
const { completeProfile } = require('../../../controllers/profile/profileController');


// Complete Profile Route
router.post(
  '/complete',
  upload.array('images', 5), // Upload up to 5 images
  completeProfile
);

// Complete Profile Route
router.post(
  '/update',
  upload.array('images', 5), // Upload up to 5 images
  completeProfile
);

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
    return;
  }
  res.send(user);
});




module.exports = router;
