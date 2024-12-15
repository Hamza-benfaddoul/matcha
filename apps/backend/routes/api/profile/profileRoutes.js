const express = require('express');
const upload = require('../../../middleware/multerConfig');
const { completeProfile } = require('../../../controllers/profile/profileController');
const { getUserImages } = require('../../../controllers/profile/profileController');

const router = express.Router();
// Complete Profile Route
router.post(
  '/',
  upload.array('images', 5), // Upload up to 5 images
  completeProfile
);


// Get User Images Route
router.get(
  '/:userId',
  getUserImages
);

module.exports = router;