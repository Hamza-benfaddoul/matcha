require('dotenv').config();
 
const pg = require('pg')
const { Client } = pg



const client = new Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "matcha_db",
  password: process.env.DB_PASS || "password",
  port: process.env.DB_PORT || 5432,
})

console.log("client", client)


// const UserTableQuery =`
// CREATE TABLE IF NOT EXISTS users (
// id SERIAL PRIMARY KEY,
// firstName VARCHAR(255) NOT NULL,
// lastName VARCHAR(255) NOT NULL,
// refreshToken VARCHAR(255) ,
// isEmailVerified BOOLEAN DEFAULT FALSE,
// email VARCHAR(255) NOT NULL,
// password VARCHAR(255) NOT NULL
// )`

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
  biography TEXT,
  fame_rating INTEGER DEFAULT 0,
  location_latitude DECIMAL(9,6),
  location_longitude DECIMAL(9,6),
  isProfileComplete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

const UserPhotosTableQuery = `
CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  file_path VARCHAR(255) NOT NULL,
  is_profile_picture BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const InterestsTableQuery = `
CREATE TABLE IF NOT EXISTS interests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);
`;

const UserInterestsTableQuery = `
CREATE TABLE IF NOT EXISTS user_interests (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  interest_id INTEGER REFERENCES interests(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, interest_id)
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

// crate user table 
const createTables =  async () => {
  try {
  await client.connect();
  console.log('Connected to database');
  await client.query(UserTableQuery);
  await client.query(VerificationTokenTableQuery);
  await client.query(UserPhotosTableQuery);
  await client.query(InterestsTableQuery);
  await client.query(UserInterestsTableQuery);
  await client.query(ViewsTableQuery);
  await client.query(LikeTableQuery);
  console.log('Tables created successfully');
  }catch(err){
    console.log(err);
  }finally{
    await client.end()
  }
}

createTables();
