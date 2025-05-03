const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../db/db");
const { sendPasswordResetEmail } = require("../../lib/mail");
const { resetPasswordSchema } = require("../../schemas/password-schemas");
const { findUserByEmail } = require("../../models/users");

const handlePasswordResetRequest = async (req, res) => {
  // Validate request body
  const { error, value } = resetPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: "Invalid email address" });
  }

  try {
    // Check if user exists
    const user = await findUserByEmail(value.email);
    if (!user) {
      // Return success even if user doesn't exist (security measure)
      return res
        .status(200)
        .send({ message: "If the email exists, a reset link has been sent" });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.RESET_TOKEN_SECRET,
      { expiresIn: "1h" },
    );

    // Store token in database
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await db.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, resetToken, expiresAt.toISOString()],
    );
    const newToken = await db.query(
      "INSERT INTO verification_tokens (email, token, expires) VALUES ($1, $2, $3)",
      [user.email, resetToken, expiresAt.toISOString()],
    );

    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).send({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).send({ error: "Failed to process password reset request" });
  }
};

const handlePasswordReset = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .send({ error: "Token and new password are required" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);

    // Check if token exists in database and isn't expired
    const tokenRecord = await db.query(
      "SELECT * FROM password_reset_tokens WHERE token = $1 AND user_id = $2 AND expires_at > NOW()",
      [token, decoded.userId],
    );

    if (tokenRecord.rows.length === 0) {
      return res.status(400).send({ error: "Invalid token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      decoded.userId,
    ]);

    // Delete used token
    await db.query("DELETE FROM password_reset_tokens WHERE token = $1", [
      token,
    ]);

    res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).send({ error: "Token has expired" });
    }
    res.status(500).send({ error: "Failed to reset password" });
  }
};

module.exports = {
  handlePasswordResetRequest,
  handlePasswordReset,
};
