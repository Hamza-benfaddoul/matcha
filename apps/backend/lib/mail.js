const nodemailer = require("nodemailer");

// Create a transporter object using SMTP with Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER, // Your Gmail address
    pass: process.env.SMTP_PASS, // Your Gmail password or app password
  },
});

const sendTwoFactorTokenEmail = async (email, token) => {
  await transporter.sendMail({
    from: "benfaddoul01@gmail.com",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code ${token}</a> `,
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `${process.env.CLIENT_URL}/auth/new-password?token=${token}`;

  await transporter.sendMail({
    from: "benfaddoul01@gmail.com",
    to: email,
    subject: "Reset  your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password`,
  });
};

const sendVerificationEmail = async (email, token) => {
  const confirmLink = `${process.env.CLIENT_URL}/new-verification?token=${token}`;
  await transporter.sendMail({
    from: "benfaddoul09@gmail.com",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email`,
  });
};

module.exports = {
  sendVerificationEmail,
  sendTwoFactorTokenEmail,
  sendPasswordResetEmail,
};
