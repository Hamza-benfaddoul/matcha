const express =       require('express')
const app     =       express()

const { sendVerificationEmail } = require('./lib/mail.js');

const { logger } = require('./middleware/logEvent.js')

const verifyJWT = require('./middleware/verifyJWT');

const cookieparser =  require('cookie-parser');
const cors =          require('cors');

const port    =       process.env.PORT | 5000
const corsOptions =   require('./conf/corsOrigins');
const credentials = require('./middleware/credentials');

// custom middleware logger
app.use(logger);

//handle options credentials check - before CORS!
app.use(credentials);

// Cors Origins Resource Sharing
app.use(cors(corsOptions))

app.use(express.json());

app.use(cookieparser());

//routes
app.use('/login',     require('./routes/api/auth/login'));
app.use("/register",  require('./routes/api/auth/register'));
app.use('/logout',   require('./routes/api/auth/logout'));
app.use('/refresh',   require('./routes/api/auth/refresh'));

// protected routes
app.use(verifyJWT);
app.use('/users',     require('./routes/api/user/user'));


app.use((err, req, res, next)=>{
  console.error(err.stack)
  res.status(500).send(err.message)
});

app.all('*', (req, res)=>{
  res.status(404)
  res.json({error: 404 , message: 'Not Found'})
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
