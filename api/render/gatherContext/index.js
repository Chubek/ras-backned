const Resume = require("../../../modules/resume/model");
const _ = require("lodash");

async function gatherContext(resumeId, userId) {
  let context = {};
  const resume = await Resume.findOne({ _id: resumeId });

  if (resume.createdInfo.userId !== userId) {
    throw new Error("This resume is not being accessed by the creator.");
  }

  _.forOwn(resume, function (value, key) {
    if (
      key !== "createdInfo" &&
      key !== "templateInfo" &&
      key !== "editCaptures"
    ) {
      context[key] = value;
    }
  });

  return context;
}

exports.gatherContext = gatherContext;
