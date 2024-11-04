const { findUserByEmail } = require('../models/users');
const handleLogout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  // Destructuring refreshToken from cookie
  const refreshToken = cookies.jwt;
  // is Refresh token in db
  const user = {}
  if(!user){
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true});
    return res.sendStatus(204);
  }
  // Delete the refersh token in db
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true});
  res.sendStatus(204);

}

module.exports = { handleLogout}

