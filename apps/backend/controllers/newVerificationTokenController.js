const db = require("../db/db");

const {
  getVerificationTokenByToken,
  deleteVerificationToken,
} = require("../models/verification_tokens");

const {
  findUserByEmail,
  updateNewVerificationToken,
} = require("../models/users");

const handleNewVerificationToken = async (req, res) => {
  const existingToken = await getVerificationTokenByToken(req.body.token);
  console.log("existingToken", existingToken);

  if (!existingToken) {
    return res.status(400).json({ error: "Token does not exist!" });
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return res.status(400).json({ error: "Token has expired!" });
  }

  const existingUser = await findUserByEmail(existingToken.email);

  if (!existingUser) {
    return res.status(400).json({ error: "Email does not exist!" });
  }

  console.log("daz");

  const updatedUser = await updateNewVerificationToken(existingUser.email);
  const deletedVerificationToken = await deleteVerificationToken(
    existingToken.token,
  );

  res.status(200).json({ success: "Email verified!" });
};

module.exports = {
  handleNewVerificationToken,
};
