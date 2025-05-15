// controllers/auth/googleAuthController.js
const jwt = require("jsonwebtoken");
const { updateRefreshToken } = require("../../models/users");

const handleGoogleAuthSuccess = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Google authentication failed" });
  }

  try {
    const user = req.user;

    // Create tokens (similar to your login controller)
    const accessToken = jwt.sign(
      {
        userInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isProfileCompleted: user.isProfileComplete,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10min" },
    );

    const refreshToken = jwt.sign(
      { email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    await updateRefreshToken(refreshToken, user.id);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password, ...userWithoutPassword } = user;

    res.redirect("/");
    //   status(200).json({
    //   accessToken,
    //   user: userWithoutPassword,
    // });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

const handleGoogleAuthFailure = (req, res) => {
  res.status(401).json({ error: "Google authentication failed" });
};

module.exports = {
  handleGoogleAuthSuccess,
  handleGoogleAuthFailure,
};
