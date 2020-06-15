const Resume = require("../../../Modules/Resume/Model");
const _ = require("lodash");

async function gatherContext(resumeId, userId) {
  let context = {};
  const resume = await Resume.findOne({ _id: resumeId });

  if (resume.createdInfo.userId !== userId) {
    throw new Error("This resume is not being accessed by the creator.");
  }

  context["name"] = resume.createdInfo.resumeName;
  context["firstName"] = resume.contactInfo.firstName;
  context["lastName"] = resume.contactInfo.lastName;
  context["phoneNumber"] = resume.contactInfo.phoneNumber;
  context["email"] = resume.contactInfo.emailAddress;
  context["state"] = resume.contactInfo.state;
  context["city"] = resume.contactInfo.city;
  context["zipCode"] = resume.contactInfo.zipCode;
  context["objective"] = resume.summaryObjective.objective;
  context["bluf"] = resume.summaryObjective.bluf;
  context["summary"] = resume.summaryObjective.summary;

  return context;
}

exports.gatherContext = gatherContext;
