// middleware/verifyJWT.js
const jwt = require("jsonwebtoken");
const findUserByEmail = require("../models/users").findUserByEmail;

// Make the middleware work for both Express and Socket.io
const verifyJWT = async (reqOrSocket, resOrNext, next) => {
  let token;

  // Handle Socket.io case
  if (reqOrSocket.handshake) {
    const socket = reqOrSocket;
    const next = resOrNext;

    token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token ||
      socket.request.headers.cookie?.split("jwt=")[1]?.split(";")[0];

    if (!token) return next(new Error("No token provided"));

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) return next(new Error("Invalid token"));

      socket.user = {
        email: decoded.email,
        userInfo: decoded.userInfo,
        userId: decoded.userId,
      };
      next();
    });
  }
  // Handle Express case
  else {
    const req = reqOrSocket;
    const res = resOrNext;

    const authHeader = req.headers.authorization || req.headers.Authorization;
    token = req.cookies.jwt;

    if (!authHeader?.startsWith("Bearer ") && !token)
      return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.sendStatus(403); //invalid token
      req.userInfo = decoded?.userInfo;
      req.userEmail = decoded?.email;
      const user = await findUserByEmail(decoded.email);
      req.userId = user.id;
      next();
    });
  }
};

module.exports = verifyJWT;
