const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const { sendVerificationEmail } = require("../lib/mail");

const {
  createUser,
  findUserByEmail,
  findUserbyUserName,
  validateUser,
} = require("../models/users");

const handleNewUser = async (req, res) => {
  const { error, value } = validateUser(req.body);
  if (error) {
    console.error("Registration failed", error);
    // 400 Bad requiset
    res.status(400).send({
      error: "Registration failed",
    });
    return;
  }

  const ifUserExists = await findUserByEmail(value.email);
  if (ifUserExists) {
    // 400 Bad requiset
    res.status(400).send({ error: "The email is already registered." });
    return;
  }

  const ifUserNameExists = await findUserbyUserName(value.userName);
  if (ifUserNameExists) {
    // 400 Bad requiset
    res.status(400).send({ error: "The user name is already registered." });
    return;
  }

  const hashedPassword = await bcrypt.hash(value.password, 10);

  // hashed password
  const user = {
    firstName: value.firstName,
    lastName: value.lastName,
    birth_date: value.birth_date,
    userName: value.userName,
    email: value.email,
    password: hashedPassword,
  };
  const verificationToken = jwt.sign(
    { email: user.email },
    "verificationToken",
    { expiresIn: "1h" },
  );
  const newUser = await createUser(user);
  const expiresat = new Date(Date.now() + 60 * 60 * 1000); // 1 hour later
  const expires = expiresat.toISOString();

  const newToken = await db.query(
    "INSERT INTO verification_tokens (email, token, expires) VALUES ($1, $2, $3) RETURNING *",
    [user.email, verificationToken, expires],
  );
  if (newUser && newToken) {
    await sendVerificationEmail(user.email, verificationToken);
    res.status(200).send(newUser);
  } else res.status(201).send({ error: "Somting went wrong!" });
};

module.exports = {
  handleNewUser,
};
