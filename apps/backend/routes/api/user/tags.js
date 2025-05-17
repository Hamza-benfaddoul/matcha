const express = require('express');
const getTagsList = require('../../../controllers/profile/TagsController').getTagsList;
const getUserTags = require('../../../controllers/profile/TagsController').getUserTags;

const router = express.Router();



router.get('/tagslist', (req, res) => getTagsList(req, res));
router.get('/:id', (req, res) => getUserTags(req, res));

module.exports = router;
