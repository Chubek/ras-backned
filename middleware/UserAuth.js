/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com --- April 2020, Corona Times */

const admin = require("firebase-admin");

function UserAuth(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token)
    return res.status(401).json({ message: "No token, access denied." });

  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      req["user-id"] = uid;
      next();
    })
    .catch((e) => {
      console.error(e);
    });
}

module.exports = UserAuth;
