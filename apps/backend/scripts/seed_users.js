require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "db",
  password: process.env.DB_PASS || "password",
  port: process.env.DB_PORT || 5432,
});

const users = [
  {
    firstName: "Alice",
    lastName: "Smith",
    username: "alice123",
    email: "alice@example.com",
    password: "password123",
    gender: "female",
    sexual_preferences: "heterosexual",
    fame_rating: 50,
    latitude: 34.020882,
    longitude: -6.84165,
    birth_date: "1990-01-01",
    tags: ["#music", "#sport"],
    profileImage: "https://i.pravatar.cc/300?img=1",
  },
  {
    firstName: "Bob",
    lastName: "Johnson",
    username: "bobby",
    email: "bob@example.com",
    password: "password123",
    gender: "male",
    sexual_preferences: "heterosexual",
    fame_rating: 60,
    latitude: 34.019456,
    longitude: -6.843322,
    birth_date: "1988-05-12",
    tags: ["#sport", "#movies"],
    profileImage: "https://i.pravatar.cc/300?img=2",
  },
  {
    firstName: "Charlie",
    lastName: "Williams",
    username: "charlie_w",
    email: "charlie@example.com",
    password: "password123",
    gender: "male",
    sexual_preferences: "bisexual",
    fame_rating: 40,
    latitude: 34.018101,
    longitude: -6.838201,
    birth_date: "1992-09-23",
    tags: ["#vegan", "#music"],
    profileImage: "https://i.pravatar.cc/300?img=3",
  },
  {
    firstName: "Diana",
    lastName: "Brown",
    username: "diana_b",
    email: "diana@example.com",
    password: "password123",
    gender: "female",
    sexual_preferences: "bisexual",
    fame_rating: 70,
    latitude: 34.021234,
    longitude: -6.839823,
    birth_date: "1995-03-15",
    tags: ["#movies", "#music"],
    profileImage: "https://i.pravatar.cc/300?img=4",
  },
  {
    firstName: "Ethan",
    lastName: "Davis",
    username: "ethan_d",
    email: "ethan@example.com",
    password: "password123",
    gender: "male",
    sexual_preferences: "homosexual",
    fame_rating: 80,
    latitude: 34.016734,
    longitude: -6.842876,
    birth_date: "1987-11-30",
    tags: ["#sport", "#vegan"],
    profileImage: "https://i.pravatar.cc/300?img=5",
  },
  {
    firstName: "Fiona",
    lastName: "Miller",
    username: "fiona_m",
    email: "fiona@example.com",
    password: "password123",
    gender: "female",
    sexual_preferences: "homosexual",
    fame_rating: 90,
    latitude: 34.022908,
    longitude: -6.837215,
    birth_date: "1993-07-08",
    tags: ["#vegan", "#music"],
    profileImage: "https://i.pravatar.cc/300?img=6",
  },
  {
    firstName: "George",
    lastName: "Wilson",
    username: "george_w",
    email: "george@example.com",
    password: "password123",
    gender: "male",
    sexual_preferences: "heterosexual",
    fame_rating: 55,
    latitude: 34.017543,
    longitude: -6.840204,
    birth_date: "1991-02-19",
    tags: ["#sport", "#music"],
    profileImage: "https://i.pravatar.cc/300?img=7",
  },
  {
    firstName: "Hannah",
    lastName: "Moore",
    username: "hannah_m",
    email: "hannah@example.com",
    password: "password123",
    gender: "female",
    sexual_preferences: "heterosexual",
    fame_rating: 75,
    latitude: 34.019234,
    longitude: -6.844329,
    birth_date: "1994-06-25",
    tags: ["#movies", "#vegan"],
    profileImage: "https://i.pravatar.cc/300?img=8",
  },
  {
    firstName: "Ian",
    lastName: "Taylor",
    username: "ian_t",
    email: "ian@example.com",
    password: "password123",
    gender: "male",
    sexual_preferences: "bisexual",
    fame_rating: 65,
    latitude: 34.020989,
    longitude: -6.840014,
    birth_date: "1990-12-10",
    tags: ["#music", "#vegan"],
    profileImage: "https://i.pravatar.cc/300?img=9",
  },
  {
    firstName: "Julia",
    lastName: "Anderson",
    username: "julia_a",
    email: "julia@example.com",
    password: "password123",
    gender: "female",
    sexual_preferences: "bisexual",
    fame_rating: 85,
    latitude: 34.018928,
    longitude: -6.843211,
    birth_date: "1989-04-17",
    tags: ["#music", "#movies"],
    profileImage: "https://i.pravatar.cc/300?img=10",
  },
];


const seedUsers = async () => {
  try {
    await client.connect();
    console.log("Connected to DB");

    for (const user of users) {
      const { username, email } = user;

      // 1. Find user if exists
      const { rows: existing } = await client.query(
        `SELECT id FROM users WHERE username = $1 OR email = $2`,
        [username, email],
      );

      if (existing.length > 0) {
        const userId = existing[0].id;

        console.log(`🧹 Removing existing user: ${username}`);

        // Remove dependent rows first
        await client.query(`DELETE FROM images WHERE user_id = $1`, [userId]);
        await client.query(`DELETE FROM tags WHERE user_id = $1`, [userId]);

        // Finally remove user
        await client.query(`DELETE FROM users WHERE id = $1`, [userId]);
      }

      // 2. Insert user
      const {
        firstName,
        lastName,
        password,
        gender,
        sexual_preferences,
        fame_rating,
        latitude,
        longitude,
        birth_date,
        tags,
        profileImage,
      } = user;

      const { rows } = await client.query(
        `
        INSERT INTO users (
          firstName, lastName, username, email, password,
          gender, sexual_preferences, fame_rating,
          location_latitude, location_longitude, birth_date,
          isProfileComplete, isEmailVerified
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true,true)
        RETURNING id
        `,
        [
          firstName,
          lastName,
          username,
          email,
          password,
          gender,
          sexual_preferences,
          fame_rating,
          latitude,
          longitude,
          birth_date
        ],
      );

      const newUserId = rows[0].id;

      // 3. Insert profile image
      const imageResult = await client.query(
        `INSERT INTO images (user_id, image_url, is_profile_picture) VALUES ($1, $2, true)  RETURNING image_url`,
        [newUserId, profileImage],
      );

      // 3. Insert profile imag
      const imageId = imageResult.rows[0].image_url;

      // 4. Set profile image ID
      await client.query(
        `UPDATE users SET profile_picture = $1 WHERE id = $2`,
        [imageId, newUserId],
      );

      // 5. Insert tags
      for (const tag of tags) {
        await client.query(`INSERT INTO tags (user_id, tag) VALUES ($1, $2)`, [
          newUserId,
          tag,
        ]);
      }

      console.log(`✅ Inserted user ${username}`);
    }

    console.log("🎉 All test users seeded successfully.");
  } catch (err) {
    console.error("❌ Error seeding users:", err);
  } finally {
    await client.end();
  }
};

seedUsers();