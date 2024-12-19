const db =  require('../../db/db');
const findOne = require('../../models/users').findOne;



exports.getUserImages = async (req, res) => {
    const userId = req.params.userId;
    const user = await findOne(userId);
    const images = await db.query('SELECT * FROM images WHERE user_id = $1', [user.id]);
    res.json(images.rows);
  };