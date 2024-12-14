const db =  require('../../db/db');
const findUserByEmail = require('../../models/users').findUserByEmail;
const completeProfile = require('../../models/users').completeProfile;
const path = require('path');
const { updateProfile } = require('../../models/users');

// Controller to handle profile completion
exports.completeProfile = async (req, res) => {
  const email = req?.userEmail; // Assuming user ID is decoded from JWT and stored in req.userInfo
  const user = await findUserByEmail(email);
  const { gender, sexualPreferences, biography, interests, profileImageIndex } = req.body;
  const files = req.files;

  try {
    try {
      const updatedUser = await completeProfile(user.id, { gender, sexualPreferences, biography });
    }
    catch (err) {
      console.error('Error completing profile:', err);
      res.status(500).json({ error: 'Failed to complete profile.' });
    }
 
    // Insert interests
    if (interests && Array.isArray(interests)) {
      const insertTagQuery = 'INSERT INTO tags (user_id, tag) VALUES ($1, $2)';
      for (const tag of interests) {
      await db.query(insertTagQuery, [user.id, tag]);
      }
    }

    // Save images
    if (files && files.length > 0) {
      const insertImageQuery = 'INSERT INTO images (user_id, image_url, is_profile_picture) VALUES ($1, $2, $3)';
      for (const file of files) {
        const filePath = `/uploads/${file.filename}`;
        // await db.query(insertImageQuery, [user.id, filePath]);
        const isProfileImage = files.indexOf(file) === Number(profileImageIndex);
        if (isProfileImage)
        {
          await db.query(insertImageQuery, [user.id, filePath, true]);  
          await db.query('UPDATE users SET profile_picture = $1 WHERE id = $2', [filePath, user.id]);
        }
        else
          await db.query(insertImageQuery, [user.id, filePath, false]);
      }
    }
    const user_data = await findUserByEmail(email);

    res.status(200).json({ message: 'Profile completed successfully!' , user: user_data});
  } catch (error) {
    console.error('Error completing profile:', error);
    res.status(500).json({ error: 'Failed to complete profile.' });
  }
};
