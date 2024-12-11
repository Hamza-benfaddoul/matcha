const Joi = require("joi");
const db = require("../db/db");

const createUser = async (user) => {
  const insertUserQuery = `
    INSERT INTO users (firstName, lastName, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id, firstName, LastName, email;
  `;

  try {
    const res = await db.query(insertUserQuery, [
      user.firstName,
      user.lastName,
      user.email,
      user.password,
    ]);
    return res.rows[0];
  } catch (err) {
    console.error("ERROR: CREACT USER\n", err);
    return null;
  }
};

const findUserByName = async (name) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE name = $1", [name]);
    return res.rows[0];
  } catch (err) {
    console.error("ERROR: FIND USER BYNAME\n", err);
    return null;
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return user.rows[0];
  } catch (err) {
    console.error("ERROR: FIND USER EMAIL\n", err);
    return null;
  }
};

const findAll = async () => {
  try {
    const res = await db.query("SELECT * FROM users");
    return res.rows;
  } catch (err) {
    console.error("ERROR: FIND ALL USERS \n", err);
    return null;
  }
};

const findOne = async (userId) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
    return res.rows[0];
  } catch (err) {
    console.error("ERROR: FIND ONE USERS \n", err);
    return null;
  }
};

const validateUser = (user) => {
  const userSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return userSchema.validate(user);
};

const validateLoginUser = (user) => {
  const userSchema = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return userSchema.validate(user);
};

const updateRefreshToken = async (refershToken, userId) => {
  try {
    const res = await db.query("UPDATE users SET refreshtoken=$1 WHERE id=$2", [
      refershToken,
      userId,
    ]);
    return res.rows[0];
  } catch (err) {
    console.error("ERROR: UPDATE REFERSH TOKEN\n", err);
    return null;
  }
};

const updateNewVerificationToken = async (email) => {
  try {
    const res = await db.query(
      "UPDATE users SET isemailverified=$1 WHERE email=$2",
      [true, email],
    );

    return res.rows[0];
  } catch (err) {
    console.error("ERROR: UPDATE NEW VERIFICATION TOKEN\n", err);
    return null;
  }
};

module.exports = {
  validateUser,
  findAll,
  findOne,
  createUser,
  findUserByEmail,
  findUserByName,
  validateLoginUser,
  updateRefreshToken,
  updateNewVerificationToken,
};
