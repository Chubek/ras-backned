/*
 * Created on Wed Feb 12 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

const express = require("express");

const { silentErrorHandler, notFoundHandler } = require("../helpers");
const {
  uploadFile,
  isFileExist,
  getFileUrl,
  deleteFile,
  getFileSignedUrl,
} = require("../../services/fileStorage");
const {
  renderPageToPng,
  renderPageToPdf,
} = require("../../services/browserRenderer");
const { readAndCompileTemplate } = require("../../services/templateCompiler");
const {
  getTemplateById,
  getDummyUserById,
} = require("../../services/assetsRepository");
const { getResumeHash } = require("../../services/hashService");
const {
  validateRequestWithUserData,
  validateRequestWithDummyUser,
} = require("./validator");
const UserAuth = require("../../middleware/UserAuth");
const gatherContext = require("./gatherContext").gatherContext;

const { RENDERED_RESUME_DATA_STORAGE } = process.env;
const app = express();

const Resume = require("../../modules/resume/model");

const renderAndSaveResumeOrGetFromCache = async (
  templateId,
  userData,
  options
) => {
  const hash = getResumeHash(templateId, { userData, options });
  const pngFileName = `${hash}.png`;
  const pdfFileName = `${hash}.pdf`;

  const isExistPng = await isFileExist(
    RENDERED_RESUME_DATA_STORAGE,
    pngFileName
  );
  const isExistPdf = await isFileExist(
    RENDERED_RESUME_DATA_STORAGE,
    pdfFileName
  );
  const result = {
    pngUrl: getFileUrl(RENDERED_RESUME_DATA_STORAGE, pngFileName),
    pdfUrl: getFileUrl(RENDERED_RESUME_DATA_STORAGE, pdfFileName),
  };

  if (isExistPng && isExistPdf) {
    return result;
  }

  const template = await getTemplateById(templateId);
  const html = await readAndCompileTemplate(template.path, userData);
  const pngData = await renderPageToPng(
    html,
    `file:${template.basePath}`,
    options
  );
  const pdfData = await renderPageToPdf(
    html,
    `file:${template.basePath}`,
    options
  );
  await uploadFile(
    RENDERED_RESUME_DATA_STORAGE,
    pngFileName,
    pngData,
    "image/png"
  );
  await uploadFile(
    RENDERED_RESUME_DATA_STORAGE,
    pdfFileName,
    pdfData,
    "application/pdf"
  );

  return result;
};

//test function, no need in production
/*
router.post("/:templateId/:dummyUserId", (req, res) => {
  validateRequestWithDummyUser(req)
    .then(async (validationResult) => {
      if (validationResult !== null) {
        res
          .status(validationResult.status)
          .json({ message: validationResult.message });
        return;
      }

      const userData = await getDummyUserById(req.params.dummyUserId);
      const result = await renderAndSaveResumeOrGetFromCache(
        req.params.templateId,
        userData,
        req.body.options || {}
      );
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});
*/

app.post("/:resumeId/:templateId", UserAuth, async (req, res) => {
  const userId = req["user-id"];

  const context = gatherContext(req.params.resumeId, userId);

  const result = await renderAndSaveResumeOrGetFromCache(
    req.params.templateId,
    context,
    req.body.options || {}
  );
  res.status(200).json(result);
});

app.get("/request/url/:resumeId", UserAuth, async (req, res) => {
  const resumeId = req.params.resumeId;
  const signed = req.body.signed === "true" ? true : false;
  const expiryDate = req.body.expiryDate;

  const resume = await Resume.findOne({ _id: resumeId });

  if (!resume) {
    res.status(200).json({ noSuchResume: true });
    return false;
  }

  const pdfFileName = resume.templateInfo.pdf.url;

  const url = getFileUrl(RENDERED_RESUME_DATA_STORAGE, pdfFileName);
  const signedUrl = getFileSignedUrl(
    RENDERED_RESUME_DATA_STORAGE,
    pdfFileName,
    expiryDate
  );

  if (signed) {
    res.status(200).json({ url: signedUrl });
    return true;
  }

  res.status(200).json({ url: url });
});

app.use("*", notFoundHandler);
app.use(silentErrorHandler);

module.exports = app;
