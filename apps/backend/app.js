const express = require('express')
const app = express()
const profileRoutes = require('./routes/api/profile/profileRoutes');
const { sendVerificationEmail } = require('./lib/mail.js');
const { logger } = require('./middleware/logEvent.js')
const verifyJWT = require('./middleware/verifyJWT');
const cookieparser = require('cookie-parser');
const cors = require('cors');
const port = process.env.PORT | 5000
const corsOptions = require('./conf/corsOrigins');
const credentials = require('./middleware/credentials');
const path = require('path');
const fs = require('fs');

// custom middleware logger
app.use(logger);

//handle options credentials check - before CORS!
app.use(credentials);

// Cors Origins Resource Sharing
app.use(cors(corsOptions))

app.use(express.json());

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(express.urlencoded({ extended: true })); // For URL-encoded data
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files




app.use(cookieparser());

//routes
app.use('/api/login', require('./routes/api/auth/login'));
app.use("/api/register", require('./routes/api/auth/register'));
app.use('/api/logout', require('./routes/api/auth/logout'));
app.use('/api/refresh', require('./routes/api/auth/refresh'));

// profile routes
app.use('/api/complete-profile', profileRoutes);


// protected routes
app.use(verifyJWT);
app.use('/api/users', require('./routes/api/user/user'));


app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send(err.message)
});

app.all('*', (req, res) => {
  res.status(404)
  res.json({ error: 404, message: 'Not Found' })
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
