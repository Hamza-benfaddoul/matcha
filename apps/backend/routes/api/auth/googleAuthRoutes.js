// routes/api/auth/googleAuthRoutes.js
const express = require("express");
const router = express.Router();
const passport = require("../../../conf/passportGoogleStrategy");
const {
  handleGoogleAuthSuccess,
  handleGoogleAuthFailure,
} = require("../../../controllers/auth/googleAuthController");

// Initial Google OAuth request
router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// Google OAuth callback
router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  handleGoogleAuthSuccess,
);

// Failure route
router.get("/failure", handleGoogleAuthFailure);

module.exports = router;
