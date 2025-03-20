require('dotenv').config(); 
const pg = require('pg')
const { Client } = pg

console.log(process.env)

const client = new Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "db",
  database: process.env.DB_NAME || "db",
  password: process.env.DB_PASS || "password",
  port: process.env.DB_PORT || 5432,
})

const UserTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  refreshToken VARCHAR(255),
  isEmailVerified BOOLEAN DEFAULT FALSE,
  gender VARCHAR(10),
  sexual_preferences VARCHAR(50),
  profile_picture VARCHAR(255) DEFAULT NULL,
  biography TEXT,
  fame_rating INTEGER DEFAULT 0,
  location_latitude DECIMAL(9,6),
  location_longitude DECIMAL(9,6),
  isProfileComplete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

const TagsListTableQuery = `
CREATE TABLE IF NOT EXISTS tags_list (
  id SERIAL PRIMARY KEY,
  tag VARCHAR(50) NOT NULL UNIQUE
);
`;

const UserTagssTableQuery = `
  CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL
  );
`;

const UserPhotosTableQuery = `
  CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  image_url VARCHAR(255) NOT NULL,
  is_profile_picture BOOLEAN DEFAULT FALSE
);
`;


const ViewsTableQuery = `
CREATE TABLE IF NOT EXISTS views (
  id SERIAL PRIMARY KEY,
  viewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  viewed_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const LikeTableQuery = `
CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  liker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  liked_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// const FameRatingLogTableQuery = `
// CREATE TABLE IF NOT EXISTS fame_rating_log (
//   id SERIAL PRIMARY KEY,
//   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//   action VARCHAR(50) NOT NULL,  -- e.g., "view", "like"
//   action_count INTEGER DEFAULT 1, -- number of views or likes
//   fame_change INTEGER NOT NULL,   -- fame points added/subtracted
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// `;

const VerificationTokenTableQuery =`
CREATE TABLE IF NOT EXISTS verification_tokens (
id SERIAL PRIMARY KEY,
email VARCHAR(255) NOT NULL,
token VARCHAR(255),
expires TIMESTAMP 
)`


const insertDefaultTags = async (client) => {
  const tags = ['#vegan', '#sport', '#music', '#movies'];
  // in case of the tag is already in the table the [ON CONFLICT (tag) DO NOTHING] do nothing :)
  const insertTagQuery = 'INSERT INTO tags_list (tag) VALUES ($1) ON CONFLICT (tag) DO NOTHING';

  try {
    for (const tag of tags) {
      await client.query(insertTagQuery, [tag]);
    }
    console.log('Default tags inserted successfully');
  } catch (err) {
    console.log(err);
  }
};

// crate user table 
const createTables =  async () => {
  try {
  await client.connect();
  console.log('Connected to database');
  await client.query(UserTableQuery);
  await client.query(VerificationTokenTableQuery);
  await client.query(UserPhotosTableQuery);
  await client.query(ViewsTableQuery);
  await client.query(LikeTableQuery);
  await client.query(UserTagssTableQuery);
  await client.query(TagsListTableQuery);

  // always keep this line at the end :)
  await insertDefaultTags(client)
  console.log('Tables created successfully');
  }catch(err){
    console.log(err);
  }finally{
    await client.end()
  }
}

createTables();
