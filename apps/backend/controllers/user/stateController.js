// controllers/search/searchController.js
const db = require("../../db/db");

const getUserState = async (req, res) => {
  try {
    const userId = req.userId;

    // Build the SQL query
    const sqlQuery = `
      SELECT 
        u.fame_rating AS famerating,
        (SELECT COUNT(*) FROM likes WHERE liked_id = $1) AS likes,
        (SELECT COUNT(*) FROM views WHERE viewed_id = $1) AS views,
        (SELECT COUNT(*) 
         FROM likes l1
         INNER JOIN likes l2 ON l1.liker_id = l2.liked_id AND l1.liked_id = l2.liker_id
         WHERE l1.liker_id = $1) AS friends
      FROM users u
      WHERE u.id = $1;
    `;

    const result = await db.query(sqlQuery, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error in StateController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getUserState };
