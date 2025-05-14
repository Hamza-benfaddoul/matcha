require("dotenv").config();
const pg = require("pg");
const { Client } = pg;

console.log(process.env);

const client = new Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "db",
  database: process.env.DB_NAME || "db",
  password: process.env.DB_PASS || "password",
  port: process.env.DB_PORT || 5432,
});

const UserTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) DEFAULT NULL,
  refreshToken VARCHAR(255),
  isEmailVerified BOOLEAN DEFAULT FALSE,
  gender VARCHAR(10),
  sexual_preferences VARCHAR(50),
  profile_picture VARCHAR(255) DEFAULT NULL,
  biography TEXT,
  fame_rating INTEGER DEFAULT 0,
  location_latitude DECIMAL(9,6),
  location_longitude DECIMAL(9,6),
  birth_date DATE, -- NEW COLUMN
  isProfileComplete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const NotificationsTableQuery = `
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- e.g., 'message', 'like', 'visit', 'match'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB, -- For storing additional data like sender_id, post_id, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP -- Optional: for temporary notifications
);
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

const BlockTableQuery = `
CREATE TABLE IF NOT EXISTS blocks (
  id SERIAL PRIMARY KEY,
  blocker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  blocked_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const ReportsTableQuery = `
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  reporter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  reported_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending'
);
`;

const VerificationTokenTableQuery = `
CREATE TABLE IF NOT EXISTS verification_tokens (
id SERIAL PRIMARY KEY,
email VARCHAR(255) NOT NULL,
token VARCHAR(255),
expires TIMESTAMP 
)`;

const MessagesTableQuery = `
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  receiver_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  message_type VARCHAR(20) NOT NULL DEFAULT 'text',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;
const PasswordResetTokenTableQuery = `
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE
)`;

const insertDefaultTags = async (client) => {
  const tags = ["#vegan", "#sport", "#music", "#movies"];
  // in case of the tag is already in the table the [ON CONFLICT (tag) DO NOTHING] do nothing :)
  const insertTagQuery =
    "INSERT INTO tags_list (tag) VALUES ($1) ON CONFLICT (tag) DO NOTHING";

  try {
    for (const tag of tags) {
      await client.query(insertTagQuery, [tag]);
    }
    console.log("Default tags inserted successfully");
  } catch (err) {
    console.log(err);
  }
};

// Add to your setupdb.js
const DateProposalsTableQuery = `
CREATE TABLE IF NOT EXISTS date_proposals (
  id SERIAL PRIMARY KEY,
  proposer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  proposed_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)`;

const DateResponsesTableQuery = `
CREATE TABLE IF NOT EXISTS date_responses (
  id SERIAL PRIMARY KEY,
  date_proposal_id INTEGER NOT NULL REFERENCES date_proposals(id) ON DELETE CASCADE,
  responder_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  response_status VARCHAR(20) NOT NULL CHECK (response_status IN ('accepted', 'declined')),
  response_message TEXT,
  responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)`;

const DateRemindersTableQuery = `
CREATE TABLE IF NOT EXISTS date_reminders (
  id SERIAL PRIMARY KEY,
  date_proposal_id INTEGER NOT NULL REFERENCES date_proposals(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_time TIMESTAMP WITH TIME ZONE NOT NULL
)`;

// crate user table
const createTables = async () => {
  try {
    await client.connect();
    console.log("Connected to database");
    await client.query(UserTableQuery);
    await client.query(VerificationTokenTableQuery);
    await client.query(PasswordResetTokenTableQuery); // Add this new table
    await client.query(UserPhotosTableQuery);
    await client.query(ViewsTableQuery);
    await client.query(LikeTableQuery);
    await client.query(UserTagssTableQuery);
    await client.query(TagsListTableQuery);
    await client.query(BlockTableQuery);
    await client.query(ReportsTableQuery);
    await client.query(MessagesTableQuery);
    await client.query(NotificationsTableQuery);
    await client.query(DateProposalsTableQuery);
    await client.query(DateResponsesTableQuery);
    await client.query(DateRemindersTableQuery);
    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token 
      ON password_reset_tokens(token)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user 
      ON password_reset_tokens(user_id)
    `);

    // always keep this line at the end :)
    await insertDefaultTags(client);
    console.log("Tables created successfully");
  } catch (err) {
    console.log(err);
  } finally {
    await client.end();
  }
};

createTables();
