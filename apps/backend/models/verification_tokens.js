const db = require("../db/db");

const updateNewVerificationToken = async (email) => {
  const updateUserQuery = `
    UPDATE users
    SET isEmailVerified = true
    WHERE email = $1
    RETURNING id, firstName, lastName, userName, email;
  `;

  try {
    const res = await db.query(updateUserQuery, [email]);
    return res.rows[0];
  } catch (err) {
    console.error("ERROR: UPDATE USER VERIFICATION\n", err);
    return null;
  }
};

const getVerificationTokenByToken = async (token) => {
  try {
    const res = await db.query(
      "SELECT * FROM verification_tokens WHERE token = $1",
      [token],
    );
    return res.rows[0];
  } catch (err) {
    console.error("ERROR: GET VERIFICATION TOKEN BY TOKEN\n", err);
    return null;
  }
};

const deleteVerificationToken = async (token) => {
  try {
    const res = await db.query(
      "DELETE FROM verification_tokens WHERE token = $1",
      [token],
    );
    return res.rows[0];
  } catch (err) {
    console.error("ERROR: DELETE VERIFICATION TOKEN\n", err);
    return null;
  }
};

module.exports = {
  getVerificationTokenByToken,
  deleteVerificationToken,
  updateNewVerificationToken,
};
