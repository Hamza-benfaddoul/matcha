const {
  getVerificationTokenByToken,
  deleteVerificationToken,
  updateNewVerificationToken,
} = require("../models/verification_tokens");

const { findUserByEmail } = require("../models/users");

const handleNewVerificationToken = async (req, res) => {
  const existingToken = await getVerificationTokenByToken(req.body.token);

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

  const updatedUser = await updateNewVerificationToken(existingUser.email);
  if (!updatedUser)
    return res.status(400).json({ error: "Failed to verify your Email!" });
  const deletedVerificationToken = await deleteVerificationToken(
    existingToken.token,
  );

  res.status(200).json({ message: "Email verified Successfully!" });
};

module.exports = {
  handleNewVerificationToken,
};
