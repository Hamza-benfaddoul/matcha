const jwt = require('jsonwebtoken');
const findUserByEmail = require('../models/users').findUserByEmail;

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = req.cookies.jwt;
    if (!authHeader?.startsWith('Bearer ') && !token) return res.sendStatus(401);
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.userInfo = decoded?.userInfo;
            req.userEmail = decoded?.email
            const user = await findUserByEmail(decoded.email);
            req.userId = user.id;
            next();
        }
    );
}

module.exports = verifyJWT
