const handleLogout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendstatus(204); // no content
  // Destructuring refreshToken from cookie
  const refreshToken = cookies.jwt;
  // // is Refresh token in db
  // const user = {};
  // if (!user) {
  //   res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  //   return res.sendStatus(204);
  // }
  // Delete the refersh token in db
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = { handleLogout };

// import { findUserByRefreshToken, deleteRefreshToken } from '../../services/authService.js';
//
// const handleLogout = async (req, res) => {
//   const cookies = req.cookies;
//   if (!cookies?.jwt) return res.sendStatus(204); // No content
//
//   const refreshToken = cookies.jwt;
//
//   try {
//     // Check if refresh token exists in the database
//     const user = await findUserByRefreshToken(refreshToken);
//     if (!user) {
//       res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
//       return res.sendStatus(204);
//     }
//
//     // Delete the refresh token from the database
//     await deleteRefreshToken(refreshToken);
//
//     // Clear the cookie
//     res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
//     res.sendStatus(204);
//   } catch (error) {
//     console.error('Error during logout:', error);
//     res.sendStatus(500); // Internal Server Error
//   }
// };
//
// export { handleLogout };
