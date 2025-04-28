// controllers/search/searchController.js
const db = require("../../db/db");

const advancedSearch = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      query = "",
      ageRange = [18, 50],
      fameRange = [0, 100],
      distance = 50,
      tags = [],
      sort = { field: "fame_rating", direction: "desc" },
    } = req.body;

    // Get current user data
    const {
      rows: [currentUser],
    } = await db.query(
      `SELECT id, gender, sexual_preferences, location_latitude, location_longitude, birth_date 
       FROM users WHERE id = $1 AND isProfileComplete = TRUE`,
      [userId],
    );

    if (!currentUser) {
      return res
        .status(404)
        .json({ message: "User not found or profile incomplete" });
    }

    // Determine preferred genders
    let preferredGenders = ["male", "female"];
    if (currentUser.sexual_preferences === "heterosexual") {
      preferredGenders = currentUser.gender === "male" ? ["female"] : ["male"];
    } else if (currentUser.sexual_preferences === "homosexual") {
      preferredGenders = [currentUser.gender];
    }

    // Calculate age range dates
    const currentDate = new Date();
    const minBirthDate = new Date(
      currentDate.getFullYear() - ageRange[1],
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    const maxBirthDate = new Date(
      currentDate.getFullYear() - ageRange[0],
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    // Build the SQL query
    let sqlQuery = `
      SELECT 
        u.id,
        u.firstName,
        u.lastName,
        u.username,
        u.gender,
        u.sexual_preferences,
        u.profile_picture,
        u.biography,
        u.fame_rating,
        u.location_latitude,
        u.location_longitude,
        u.birth_date,
        (
          SELECT ARRAY_AGG(t.tag)
          FROM tags t
          WHERE t.user_id = u.id
          ${tags.length > 0 ? `AND t.tag = ANY($${9}::text[])` : ""}
        ) AS tags,
        CAST(
          SQRT(
            POWER(u.location_latitude - $2::numeric, 2) + 
            POWER(u.location_longitude - $3::numeric, 2)
          ) * 111.0 AS NUMERIC(10,1)
        ) AS distance
      FROM users u
      WHERE u.id != $1
        AND u.isProfileComplete = TRUE
        AND u.gender = ANY($4::text[])
        AND u.birth_date BETWEEN $5 AND $6
        AND u.fame_rating BETWEEN $7 AND $8
    `;

    const queryParams = [
      currentUser.id,
      currentUser.location_latitude,
      currentUser.location_longitude,
      preferredGenders,
      minBirthDate,
      maxBirthDate,
      fameRange[0],
      fameRange[1],
    ];

    // Add tags parameter if tags exist
    if (tags.length > 0) {
      queryParams.push(tags);
    }

    // Only add distance filter if not -1
    if (distance !== -1) {
      sqlQuery += ` AND SQRT(
        POWER(u.location_latitude - $2::numeric, 2) + 
        POWER(u.location_longitude - $3::numeric, 2)
      ) * 111.0 <= $${queryParams.length + 1}::numeric`;
      queryParams.push(distance);
    }

    // Add text search
    if (query) {
      sqlQuery += ` AND (
        u.username ILIKE $${queryParams.length + 1}::text
        OR u.biography ILIKE $${queryParams.length + 1}::text
        OR EXISTS (
          SELECT 1 FROM tags t 
          WHERE t.user_id = u.id 
          AND t.tag ILIKE $${queryParams.length + 1}::text
        )
      )`;
      queryParams.push(`%${query}%`);
    }

    // Add tags filter
    if (tags.length > 0) {
      sqlQuery += ` AND EXISTS (
        SELECT 1 FROM tags t
        WHERE t.user_id = u.id
        AND t.tag = ANY($${tags.length > 0 ? 9 : queryParams.length + 1}::text[])
      )`;
    }

    // Add sorting
    const sortFieldMap = {
      age: "birth_date",
      fame_rating: "fame_rating",
      distance: "distance",
    };
    sqlQuery += ` ORDER BY ${sortFieldMap[sort.field]} ${sort.direction.toUpperCase()}`;

    // Execute query
    const { rows } = await db.query(sqlQuery, queryParams);

    // Process results
    const users = rows.map((user) => ({
      ...user,
      age: calculateAge(user.birth_date),
      distance: Number(user.distance),
      tags: user.tags || [],
    }));

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error in advanced search:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

function calculateAge(birthDate) {
  if (!birthDate) return 25;

  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

module.exports = { advancedSearch };
