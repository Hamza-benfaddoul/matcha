// models/matches.js
const db = require("../db/db");

const checkIfMatched = async (userId1, userId2) => {
  const result = await db.query(
    `SELECT 1 FROM likes 
     WHERE (liker_id = $1 AND liked_id = $2 AND EXISTS (
       SELECT 1 FROM likes 
       WHERE liker_id = $2 AND liked_id = $1
     ))`,
    [userId1, userId2],
  );
  return result.rows.length > 0;
};

const getDateProposalById = async (proposalId) => {
  const result = await db.query(`SELECT * FROM date_proposals WHERE id = $1`, [
    proposalId,
  ]);
  return result.rows[0];
};

const getMutualMatches = async (userId) => {
  const result = await db.query(
    `SELECT u.id, u.username, u.profile_picture
     FROM users u
     JOIN likes l1 ON u.id = l1.liker_id
     JOIN likes l2 ON u.id = l2.liked_id
     WHERE l1.liked_id = $1 AND l2.liker_id = $1`,
    [userId],
  );
  return result.rows;
};

module.exports = {
  checkIfMatched,
  getDateProposalById,
  getMutualMatches,
};
