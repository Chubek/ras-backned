const router = require("express").Router();
const AdminSchema = require("../model");
const ResumeSchema = require("../../resume/model");
const AdminAuth = require("../../../middleware/AdminAuth").adminAuth;
const AdminVerify = require("../../../middleware/AdminAuth").adminVerify;
const SuperAuth = require("../../../middleware/SuperAuth");
const admin = require("firebase-admin");
const _ = require("lodash");
const deleteFile = require("../../../services/fileStorage").deleteFile;
const path = require("path");

router.post("/create", SuperAuth, async (req, res) => {
  const {
    candidateEmail,
    candidatePhoneNumber,
    candidatePassword,
    candidateDisplayName,
  } = req.body;

  const userRecord = await admin.auth().createUser({
    email: candidateEmail,
    emailVerified: true,
    phoneNumber: candidatePhoneNumber,
    password: candidatePassword,
    displayName: candidateDisplayName,
    disabled: false,
  });

  const adminSchema = new AdminSchema({
    userId: userRecord.uid,
  });

  await adminSchema.save();

  res.status(200).json(200).json({ adminCreated: true });
});

router.post("/auth", AdminAuth, async (req, res) => {
  const adminToken = req.adminUserToken;
  res.status(200).json({ token: adminToken });
});

router.delete("/delete/resume/:resumeId", AdminVerify, async (req, res) => {
  const resumeId = req.params.resumeId;
  const isAdmin = req.admin;

  if (!isAdmin) {
    res.status(401).json({ notAdmin: true });
    return false;
  }

  const resume = await ResumeSchema.findOne({ _id: resumeId });

  if (!resume) {
    res.status(404).json({ noSuchResume: true });
    return false;
  }

  await ResumeSchema.deleteOne({ _id: resumeId });

  res.status(200).json({ resumeDeleted: true });
});

router.delete("/delete/resume/user/:userId", AdminVerify, async (req, res) => {
  const userId = req.params.userId;
  const isAdmin = req.admin;

  if (!isAdmin) {
    res.status(401).json({ notAdmin: true });
    return false;
  }

  const resumes = ResumeSchema.find({ "createdInfo.userId": userId });

  const ids = _.map(resumes, "_id");

  await ResumeSchema.deleteMany({ _id: { $in: ids } });

  res.status(200).json({ resumeesDeleted: ids });
});

router.delete("/delete/file/", AdminVerify, (req, res) => {
  const { RENDERED_RESUME_DATA_STORAGE } = process.env;
  const fileNames = req.filesNames;
  const isAdmin = req.admin;
  const adminId = req.adminId;

  if (!isAdmin) {
    res.status(401).json({ notAdmin: true });
    return false;
  }

  const counter = 0;
  _.map(fileNames, async (fileName) => {
    await deleteFile(RENDERED_RESUME_DATA_STORAGE, fileName);
    counter += 1;
  });

  if (counter == fileNames.length) {
    res.status(200).json({ filesDeleted: true });
  }
});

router.post("/upload/template/", AdminVerify, (req, res) => {
  const isAdmin = req.admin;
  const templateFile = req.files.template;
  const templateName = req.body.name;
  const imageNames = req.body.imageNames;

  if (!isAdmin) {
    res.status(401).json({ notAdmin: true });
    return false;
  }

  templateFile.mv(
    path.join(
      __dirname,
      "assets",
      "templates",
      templateName,
      "index.handlebars"
    ),
    (err) => {
      let count = 0;
      if (err) throw err;
      imageNames.map((image) => {
        const imageNameSplit = req.files[[image]].name.split(".");
        const extension = imageNameSplit[imageNameSplit.length - 1];
        req.files[[image]].mv(
          path.join(
            __dirname,
            "assets",
            "templates",
            templateName,
            "image_overlays",
            `image.${extension}`
          )
        ),
          (err) => {
            if (err) throw err;
            count += 1;
          };
      });

      if (count == imageNames.length) {
        res.status(200).json({ templateCreated: true });
      }
    }
  );
});

module.exports = router;
