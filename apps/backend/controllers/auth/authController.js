const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { sendVerificationEmail } = require("../../lib/mail");
const {
  findUserByEmail,
  validateLoginUser,
  updateRefreshToken,
} = require("../../models/users");

const handleLogin = async (req, res) => {
  try {
    const { error, value } = validateLoginUser(req.body);
    if (error)
      return res.status(400).send({ error: "Email or password is not valid." }); // 400 Bad requiset

    const user = await findUserByEmail(value.email);
    if (!user)
      return res.status(401).send({ error: "Email is not registered." }); // 401 Unauthorized

    const passwordsMatch = await bcrypt.compare(value.password, user.password);
    if (!passwordsMatch)
      return res.status(401).send({ error: "password is incorrect." }); // 401 Unauthorized

    if (!user.isemailverified) {
      const verificationToken = jwt.sign(
        { email: user.email },
        "verificationToken",
        { expiresIn: "1h" },
      );
      await sendVerificationEmail(user.email, verificationToken);

      return res.status(401).send({
        error: "Email  not verified check your email for verification.",
      }); // 401 Unauthorized
    }

    const { password, ...rest } = user;

    //creating a access token
    const accessToken = jwt.sign(
      {
        userInfo: {
          fristName: user.username,
          lastName: user.lastname,
          email: user.email,
          isProfileCompleted: user.isProfileComplete,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10min" },
    );

    // Creating refresh token n
    const refreshToken = jwt.sign(
      { email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    // neet to check if fails to update it in db
    await updateRefreshToken(refreshToken, user.id);

    // Assigning refresh token in http-only cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      path: "/",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.json({ accessToken, user: rest });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = {
  handleLogin,
};
