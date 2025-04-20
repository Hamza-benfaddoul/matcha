const express = require('express');
const upload = require('../../../middleware/multerConfig');
const { getUserImages, deleteImage, addImage, UpdateProfileImage } = require('../../../controllers/profile/ImageController');

const router = express.Router();

// Get User Images Route
router.get(
  '/:userId',
  getUserImages
);

router.delete(
  '/:userId/:imageId',
  deleteImage
);

router.post(
  '/add-image/:userId',
  upload.single('image'), // Assuming a single file is uploaded
  addImage
)

router.post(
  '/update-image/profile/:userId',
  upload.single('image'), // Assuming a single file is uploaded
  UpdateProfileImage
)


module.exports = router;