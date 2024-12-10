const pg = require('pg');
const { Pool } = pg

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
}

const pool = new Pool(config)

const isPoolCreation = async () => {
  try {
    const client = await pool.connect()
    console.log('Pool created and database connected successfully')
    client.release()  // Release the client back to the pool
  } catch (err) {
    console.error('Failed to create pool or connect to the database', err.stack)
  }
}

const query = (text, params) => pool.query(text, params)

module.exports = { query };
