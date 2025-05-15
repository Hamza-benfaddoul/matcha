const db = require("../../db/db");

const matchingProfiles = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 5, offset = 0 } = req.query; // Default to 5 results per request

    // Step 1: Get current user data
    const {
      rows: [user],
    } = await db.query(
      `
      SELECT id, gender, sexual_preferences, location_latitude, location_longitude
      FROM users
      WHERE id = $1
    `,
      [userId],
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Determine preferred genders based on sexual orientation
    let preferredGenders = ["male", "female"]; // default: bisexual
    if (user.sexual_preferences === "heterosexual") {
      preferredGenders = user.gender === "male" ? ["female"] : ["male"];
    } else if (user.sexual_preferences === "homosexual") {
      preferredGenders = [user.gender];
    }

    // Step 3: Get current user tags
    const { rows: tagRows } = await db.query(
      `
      SELECT tag FROM tags WHERE user_id = $1
    `,
      [userId],
    );
    const userTags = tagRows.map((row) => row.tag);

    if (userTags.length === 0) {
      return res.status(200).json({ profiles: [] }); // No tags = no matches
    }

    // Step 4: Query matching profiles
    const { rows: matchingProfiles } = await db.query(
      `
      SELECT
        u.id,
        u.username,
        u.gender,
        u.fame_rating,
        u.profile_picture,
        u.location_latitude,
        u.location_longitude,
        COUNT(t.tag) AS shared_tags_count,
        SQRT(POWER(u.location_latitude - $2, 2) + POWER(u.location_longitude - $3, 2)) AS distance
      FROM users u
      JOIN tags t ON u.id = t.user_id
      WHERE
        u.id != $1
        AND u.gender = ANY($4)
        AND t.tag = ANY($5)
      GROUP BY u.id
      ORDER BY distance ASC, shared_tags_count DESC, fame_rating DESC
        LIMIT $6 OFFSET $7
    `,
      [
        user.id,
        user.location_latitude,
        user.location_longitude,
        preferredGenders,
        userTags,
        limit,
        offset,
      ],
    );

    res.status(200).json({ profiles: matchingProfiles });
  } catch (error) {
    console.error("Error fetching matching profiles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  matchingProfiles,
};
