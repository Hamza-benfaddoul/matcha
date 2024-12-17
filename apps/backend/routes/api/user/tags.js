const express = require('express');
const getTagsList = require('../../../controllers/profile/TagsController').getTagsList;

const router = express.Router();



router.get('/tagslist', (req, res) => getTagsList(req, res));

module.exports = router;
