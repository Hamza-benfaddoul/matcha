const express = require('express')
const app = express()
const images = require('./routes/api/user/images.js');
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
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

app.use(cookieparser());

app.use(express.urlencoded({ extended: true })); // For URL-encoded data
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

//routes
app.use('/api/login', require('./routes/api/auth/login'));
app.use("/api/register", require('./routes/api/auth/register'));
app.use('/api/logout', require('./routes/api/auth/logout'));
app.use('/api/refresh', require('./routes/api/auth/refresh'));



// protected routes
app.use(verifyJWT);
app.use('/api/users', require('./routes/api/user/user'));
app.use('/api/complete-profile', images);
app.use('/api/images', images);
app.use('/api/user/views', require('./routes/api/user/views'));
app.use('/api/user/likes', require('./routes/api/user/likes'));
app.use('/api/user/tags', require('./routes/api/user/tags'));


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
