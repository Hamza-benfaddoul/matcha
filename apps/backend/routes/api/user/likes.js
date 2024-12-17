const express = require('express');
const addLikeProfile = require('../../../controllers/profile/likeController').addLikeProfile;
const getLikesProfile = require('../../../controllers/profile/likeController').getLikesProfile;
const countLikes = require('../../../controllers/profile/likeController').countLikes;

const router = express.Router();

router.post('/', (req, res) => addLikeProfile(req, res));
router.get('/:id', (req, res) => getLikesProfile(req, res));
router.get('/countLike/:id', (req, res) => countLikes(req, res));

module.exports = router;


