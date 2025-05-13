// config/passportGoogleStrategy.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { findUserByEmail, createUser } = require("../models/users");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
          return done(null, existingUser);
        }

        // Create new user from Google profile
        const newUser = await createUser({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: email,
          userName: profile.displayName.replace(/\s+/g, "").toLowerCase(),
          isEmailVerified: true, // Google already verified the email
          password: null, // No password for OAuth users
          profile_picture: profile.photos[0].value,
        });

        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
