const express = require('express');
const upload = require('../../../middleware/multerConfig');
const { getUserImages } = require('../../../controllers/profile/ImageController');

const router = express.Router();

// Get User Images Route
router.get(
  '/:userId',
  getUserImages
);

module.exports = router;