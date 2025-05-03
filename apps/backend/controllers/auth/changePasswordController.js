const db = require("../../db/db");
const bcrypt = require("bcrypt");
const { changePasswordSchema } = require("../../schemas/password-schemas");
const { findUserByEmail } = require("../../models/users");

const handleChangePassword = async (req, res) => {
  console.log("Change password request received", req.body);
  // Validate request body
  const { email, ...rest } = req.body;
  const { error, value } = changePasswordSchema.validate(rest);
  console.log("Validation result:", error, value);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  try {
    // Get user from JWT (assuming verifyJWT middleware was used)
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(value.currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(value.newPassword, 10);

    // Update password
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      user.id,
    ]);

    res.status(200).send({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).send({ error: "Failed to change password" });
  }
};

module.exports = {
  handleChangePassword,
};
