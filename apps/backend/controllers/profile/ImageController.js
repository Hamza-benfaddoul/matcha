const db =  require('../../db/db');
const findOne = require('../../models/users').findOne;



exports.getUserImages = async (req, res) => {
    const userId = req.params.userId;
    const user = await findOne(userId);
    const images = await db.query('SELECT * FROM images WHERE user_id = $1', [user.id]);
    res.json(images.rows);
};


exports.addImage = async (req, res) => {
    const userId = req.params.userId;
    const user = await findOne(userId);
    const file = req.file; // Assuming a single file is uploaded
    const isProfileImage = req.body.isProfileImage === 'true'; // Boolean flag for profile image
    const insertImageQuery = 'INSERT INTO images (user_id, image_url, is_profile_picture) VALUES ($1, $2, $3)';

    try {
        const filePath = `/uploads/${file.filename}`;
        if (isProfileImage) {
            await db.query(insertImageQuery, [user.id, filePath, true]);
            await db.query('UPDATE users SET profile_picture = $1 WHERE id = $2', [filePath, user.id]);
        } else {
            await db.query(insertImageQuery, [user.id, filePath, false]);
        }
        res.status(201).json({ message: 'Image uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image', error: error.message });
    }
};

exports.UpdateProfileImage = async (req, res) => {
    const userId = req.params.userId;
    const user = await findOne(userId);
    const file = req.file; // Assuming a single file is uploaded
    const filePath = `/uploads/${file.filename}`;
    const insertImageQuery = 'INSERT INTO images (user_id, image_url, is_profile_picture) VALUES ($1, $2, $3)';
    const deleteOldProfileImageQuery = 'DELETE FROM images WHERE user_id = $1 AND is_profile_picture = true';
    // Delete old profile image
    await db.query(deleteOldProfileImageQuery, [user.id]);
    // Insert new profile image
    await db.query(insertImageQuery, [user.id, filePath, true]);
   
    await db.query('UPDATE users SET profile_picture = $1 WHERE id = $2', [filePath, user.id]);
    res.status(200).json({ message: 'Profile image updated successfully', filePath: filePath });
}

exports.deleteImage = async (req, res) => {
    const userId = req.params.userId;
    const user = await findOne(userId);
    const imageId = req.params.imageId;
    await db.query('DELETE FROM images WHERE id = $1 AND user_id = $2', [imageId, user.id]);
    res.status(200).json({ message: 'Image deleted successfully' });
}