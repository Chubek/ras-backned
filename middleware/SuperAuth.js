const admin = require("firebase-admin");

async function SuperAuth(req, res, next) {
  const token = req.header("x-auth-token-super");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const token = decodedToken.email;

    req.isSuper = email == process.env.SUPER_ADMIN_EMAIL ? true : false;
    next();
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = SuperAuth;
