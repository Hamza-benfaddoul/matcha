// models/dates.js
const db = require("../db/db");

const createDateProposal = async (proposalData) => {
  const {
    proposer_id,
    recipient_id,
    title,
    description,
    proposed_date,
    location,
  } = proposalData;
  const result = await db.query(
    `INSERT INTO date_proposals 
     (proposer_id, recipient_id, title, description, proposed_date, location) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [proposer_id, recipient_id, title, description, proposed_date, location],
  );
  return result.rows[0];
};

const respondToDateProposal = async (responseData) => {
  const { date_proposal_id, responder_id, response_status, response_message } =
    responseData;

  // Start transaction
  await db.query("BEGIN");

  try {
    // Update the proposal status
    await db.query(
      `UPDATE date_proposals 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2`,
      [response_status, date_proposal_id],
    );

    // Record the response
    const response = await db.query(
      `INSERT INTO date_responses 
       (date_proposal_id, responder_id, response_status, response_message) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [date_proposal_id, responder_id, response_status, response_message],
    );

    await db.query("COMMIT");
    return response.rows[0];
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
};

const getDateProposalsForUser = async (userId) => {
  const result = await db.query(
    `SELECT dp.*, 
     u1.firstName as proposer_first_name, u1.lastName as proposer_last_name, u1.profile_picture as proposer_profile_picture,
     u2.firstName as recipient_first_name, u2.lastName as recipient_last_name, u2.profile_picture as recipient_profile_picture
     FROM date_proposals dp
     JOIN users u1 ON dp.proposer_id = u1.id
     JOIN users u2 ON dp.recipient_id = u2.id
     WHERE (dp.proposer_id = $1 OR dp.recipient_id = $1)
     AND dp.status != 'cancelled'`,
    [userId],
  );
  return result.rows;
};

const createDateReminder = async (reminderData) => {
  const result = await db.query(
    `INSERT INTO date_reminders 
     (date_proposal_id, user_id, reminder_time) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [
      reminderData.date_proposal_id,
      reminderData.user_id,
      reminderData.reminder_time,
    ],
  );
  return result.rows[0];
};

module.exports = {
  createDateProposal,
  respondToDateProposal,
  getDateProposalsForUser,
  createDateReminder,
};
