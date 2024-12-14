const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = req.cookies.jwt;
    console.log('authHeader: ', authHeader);
    console.log('token: ', token);
    if (!authHeader?.startsWith('Bearer ') && !token) return res.sendStatus(401);
    // token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.userInfo = decoded?.userInfo;
            req.userEmail = decoded?.email
            console.log('decoded: ', decoded);
            next();
        }
    );
}

module.exports = verifyJWT
