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
    console.log("ROWS", res.rows[0]);
    return res.rows[0];
  } catch (err) {
    console.error("ERROR: UPDATE REFERSH TOKEN\n", err);
    return null;
  }
};

const completeProfile = async (userId, profileData) => {
  const completeProfileQuery = `
    UPDATE users
    SET gender = $1,
        sexual_preferences = $2,
        biography = $3,
        fame_rating = $4,
        location_latitude = $5,
        location_longitude = $6,
        isprofilecomplete = $7
    WHERE id = $8
    RETURNING id, firstname, lastname, email, gender, sexual_preferences, biography, fame_rating, location_latitude, location_longitude, isprofilecomplete;
  `;
  try {
    const res = await db.query(completeProfileQuery, [
      profileData.gender,
      profileData.sexualPreferences,
      profileData.biography,
      profileData.fameRating || 0,
      profileData.locationLatitude || 0,
      profileData.locationLongitude || 0,
      true,
      userId,
    ]);
    return res.rows[0];
  } catch (err) {
    console.error("ERROR: COMPLETE PROFILE QUERY : --> \n", err);
    return null;
  }
};

const updateProfile = async (userId, profileData) => {
  const updateProfileQuery = `
    UPDATE users
    SET firstName = $1,
        lastName = $2,
        gender = $3,
        sexual_preferences = $4,
        biography = $5,
        fame_rating = $6,
        location_latitude = $7,
        location_longitude = $8
    WHERE id = $9
    RETURNING id, firstname, lastname, email, gender, sexual_preferences, biography, fame_rating, location_latitude, location_longitude;
  `;

  try {
    const res = await db.query(updateProfileQuery, [
      profileData.firstName,
      profileData.lastName,
      profileData.gender,
      profileData.sexualPreferences,
      profileData.biography,
      profileData.fameRating || 0,
      profileData.locationLatitude,
      profileData.locationLongitude,
      userId,
    ]);
    return res.rows[0];
  } catch (err) {
    console.error("ERROR: UPDATE PROFILE\n", err);
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
  updateProfile,
  completeProfile,
};
