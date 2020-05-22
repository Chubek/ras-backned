const admin = require("firebase-admin");
const Admin = require("../modules/admin/model");

async function AdminAuth(req, res, next) {
  const admins = await Admin.find({});
  const adminToken = req.header("x-auth-token-admin");

  const adminId = (await admin.auth().verifyIdToken(adminToken)).uid;

  for (let i = 0; i < admins.length; i++) {
    if (admins[i]._id == adminId) {
      const adminUserToken = await admin
        .auth()
        .createCustomToken(adminId, { admin: true });
      req.adminUserToken = adminUserToken;
      next();
    }
  }
}

async function AdminVerify(req, res, next) {
  const token = req.headers("x-auth-token-admin");

  try {
    const claims = await admin.auth().verifyIdToken(token);

    req.admin = claims.admin === true ? true : false;
    req.adminId = claims.uid;

    next();
  } catch (e) {
    throw new Error(e);
  }
}

exports.adminAuth = AdminAuth;
exports.adminVerify = AdminVerify;
