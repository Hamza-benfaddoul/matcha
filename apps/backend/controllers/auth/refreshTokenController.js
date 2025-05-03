const jwt = require("jsonwebtoken");

const { findUserByEmail } = require("../../models/users");

const handleRefreshToken = async (req, res) => {
  const { jwt: refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await findUserByEmail(decoded.email);

    if (!user) return res.sendStatus(403); // Forbidden

    const accessToken = jwt.sign(
      {
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" },
    );

    return res.json({
      user: user,
      accessToken,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.sendStatus(403); // Forbidden
    }
    return res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { handleRefreshToken };
