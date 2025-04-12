const express = require('express');
const addViewProfile = require('../../../controllers/profile/ViewsController').addViewProfile;
const getViewsProfile = require('../../../controllers/profile/ViewsController').getViewsProfile;
const countViews = require('../../../controllers/profile/ViewsController').countViews;

const router = express.Router();

const calculateFameRating = async (userId) => {
  try {
    const likesCount = await db.query('SELECT COUNT(*) FROM likes WHERE liked_id = $1', [userId]);
    const viewsCount = await db.query('SELECT COUNT(*) FROM views WHERE viewed_id = $1', [userId]);
    const fameRating = likesCount.rows[0].count * 2 + viewsCount.rows[0].count;

    // Update the fame rating in the user record
    await db.query('UPDATE users SET fame_rating = $1 WHERE id = $2', [fameRating, userId]);

    return fameRating;
  } catch (error) {
    console.error('ERROR: CALCULATE FAME RATING\n', error);
    return null;
  }
};


router.post('/', (req, res) => addViewProfile(req, res));
router.get('/:id', (req, res) => getViewsProfile(req, res));
router.get('/countViews/:id', (req, res) => countViews(req, res));

module.exports = router;
