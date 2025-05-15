const express = require('express');
const addViewProfile = require('../../../controllers/profile/ViewsController').addViewProfile;
const getViewsProfile = require('../../../controllers/profile/ViewsController').getViewsProfile;
const countViews = require('../../../controllers/profile/ViewsController').countViews;

const router = express.Router();

router.post('/add-view', (req, res) => addViewProfile(req, res));
router.get('/:id', (req, res) => getViewsProfile(req, res));
router.get('/countViews/:id', (req, res) => countViews(req, res));

module.exports = router;
