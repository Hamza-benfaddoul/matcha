const { Pool } = require('pg');
const pool = new Pool();
const path = require('path');

// Controller to handle profile completion
exports.completeProfile = async (req, res) => {
  console.log('Received profile completion request');
  const userId = req.user.id; // Assuming user ID is passed in request (e.g., from auth middleware)
  const { gender, sexualPreferences, biography, interests } = req.body;
  const files = req.files;

  try {
    // Update user's profile
    const updateUserQuery = `
      UPDATE users
      SET gender = $1, sexual_preferences = $2, biography = $3, isProfileComplete = $4, updated_at = NOW()
      WHERE id = $5
    `;
    await pool.query(updateUserQuery, [gender, sexualPreferences, biography, true, userId]);

    // Insert interests
    if (interests && Array.isArray(interests)) {
      const insertInterestQuery = 'INSERT INTO interests (user_id, interest) VALUES ($1, $2)';
      for (const interest of interests) {
        await pool.query(insertInterestQuery, [userId, interest]);
      }
    }

    // Save images
    if (files && files.length > 0) {
      const insertImageQuery = 'INSERT INTO images (user_id, image_url) VALUES ($1, $2)';
      for (const file of files) {
        const filePath = `/uploads/${file.filename}`;
        await pool.query(insertImageQuery, [userId, filePath]);
      }
    }

    res.status(200).json({ message: 'Profile completed successfully!' });
  } catch (error) {
    console.error('Error completing profile:', error);
    res.status(500).json({ error: 'Failed to complete profile.' });
  }
};
