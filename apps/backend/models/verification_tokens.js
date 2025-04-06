const db = require("../db/db");

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

module.exports = { getVerificationTokenByToken, deleteVerificationToken };
