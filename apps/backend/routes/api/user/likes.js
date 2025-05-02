const express = require('express');
const addLikeProfile = require('../../../controllers/profile/likeController').addLikeProfile;
const getLikesProfile = require('../../../controllers/profile/likeController').getLikesProfile;
const countLikes = require('../../../controllers/profile/likeController').countLikes;
const isLiked = require('../../../controllers/profile/likeController').isLiked;
const removeLike = require('../../../controllers/profile/likeController').removeLikeProfile;


const router = express.Router();

router.post('/remove', (req, res) => removeLike(req, res));
router.get('/isLiked', (req, res) => isLiked(req, res));
router.post('/', (req, res) => addLikeProfile(req, res));
router.get('/:id', (req, res) => getLikesProfile(req, res));
router.get('/countLike/:id', (req, res) => countLikes(req, res));

module.exports = router;

