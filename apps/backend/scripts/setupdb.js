const pg = require('pg')
const { Client } = pg
/* 
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
})
*/

const client = new Client({
  user: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: "password",
  port: process.env.DB_PORT,
})


const UserTableQuery =`
CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
firstName VARCHAR(255) NOT NULL,
lastName VARCHAR(255) NOT NULL,
refreshToken VARCHAR(255) ,
isEmailVerified BOOLEAN DEFAULT FALSE,
email VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL
)`

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
  await client.query(UserTableQuery);
  await client.query(VerificationTokenTableQuery);
  console.log('Tables created successfully');
  }catch(err){
    console.log(err);
  }finally{
    await client.end()
  }
}

createTables();
