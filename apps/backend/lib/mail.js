const nodemailer = require("nodemailer");

// Create a transporter object using SMTP with Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
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

const sendVerificationEmail = async (email, token) => {
  const confirmLink = `${process.env.CLIENT_URL}/new-verification?token=${token}`;
  await transporter.sendMail({
    from: "benfaddoul09@gmail.com",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email`,
  });
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const confirmLink = `${process.env.CLIENT_URL}/new-verification?token=${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${confirmLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  // Send email using your email transport
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendTwoFactorTokenEmail,
  sendPasswordResetEmail,
};
