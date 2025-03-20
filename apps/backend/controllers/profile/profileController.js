const db =  require('../../db/db');
const findUserByEmail = require('../../models/users').findUserByEmail;
const completeProfile = require('../../models/users').completeProfile;
const updateProfile = require('../../models/users').updateProfile;
const path = require('path');

// Controller to handle profile completion
exports.completeProfile = async (req, res) => {
  const email = req?.userEmail; // Assuming user ID is decoded from JWT and stored in req.userInfo
  const user = await findUserByEmail(email);
  const { gender, sexualPreferences, biography, interests = [], profileImageIndex } = req.body;
  const files = req.files;

  console.log('req.body', req.body);
  try {
    try {
      if (req.body.firstName && req.body.lastName) {
        console.log('Updating first and last name', req.body);
        const updatedUser = await updateProfile(user.id, { gender, sexualPreferences, biography, firstName: req.body.firstName, lastName: req.body.lastName });
      }
      const updatedUser = await completeProfile(user.id, { gender, sexualPreferences, biography });
    }
    catch (err) {
      console.error('Error completing profile:', err);
      res.status(500).json({ error: 'Failed to complete profile.' });
    }
 
    // Insert interests
    // console.log('Interests: ', interests, user.id);

    console.log('Interests: ', interests, user.id);
    if (interests) {
      const deleteTagsQuery = 'DELETE FROM tags WHERE user_id = $1';
      const deleted = await db.query(deleteTagsQuery, [user.id]);
      

      console.log('Deleted tags: ', deleted);

      const insertTagQuery = 'INSERT INTO tags (user_id, tag) VALUES ($1, $2)';
      const insertTagListQuery = 'INSERT INTO tags_list (tag) VALUES ($1) ON CONFLICT (tag) DO NOTHING';

      if (Array.isArray(interests)) {
        for (const tag of interests) {
          await db.query(insertTagListQuery, [tag]);
          await db.query(insertTagQuery, [user.id, tag]);
        }
      } else {
        await db.query(insertTagListQuery, [interests]);
        await db.query(insertTagQuery, [user.id, interests]);
      }
      // if (Array.isArray(interests)){

      //   for (const tag of interests) {
      //     await db.query(insertTagQuery, [user.id, tag]);
      //   }
      // }
      // else {
      //   await db.query(insertTagQuery, [user.id, interests]);
      // }
    }

    // Save images
    if (files && files.length > 0) {
      const deleteImagesQuery = 'DELETE FROM images WHERE user_id = $1';
      await db.query(deleteImagesQuery, [user.id]);
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


