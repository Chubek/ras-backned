process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const Resume = require("../modules/resume/model");
const signInAndGetToken = require("./firebase").signInAndGetToken;
const firebaseSetUp = require("./firebase").setUp;
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../test-server").app;
const expect = require("chai").expect;
const admin = require("firebase-admin");

chai.use(chaiHttp);

describe("Render", function () {
  let token, userId;
  let resumeId;
  before(async function () {
    firebaseSetUp();
    token = await signInAndGetToken("aurlito@riseup.net", "H3ll0W0rld");
    userId = await admin.auth().verifyIdToken(token);
    Resume.deleteMany({});
    const resume = new Resume({
      "createdInfo.userId": userId.uid,
      "createdInfo.resumeName": "My Resume",
      "contactInfo.firstName": "Jagga",
      "contactInfo.lastName": "Kirobi",
      "contactInfo.phoneNumber": "555-555-1234",
      "contactInfo.emailAddress": "kello@jello.com",
      "contactInfo.city": "Algiers",
      "contactInfo.state": "AK - Alaska",
      "contactInfo.zipCode": "12345",
      "summaryObjective.objective": ["Rio", "Dio", "Harp"],
      "summaryObjective.summary": ["biodio", "kio hio", "lio dio"],
      "summaryObjective.bluf": ["gggf", "sgdawdg"],
      historyExperience: [
        {
          companyName: "Avacado Dado",
          location: "Brazil",
          datesFrom: "2013",
          datesTo: "2301",
          dutiesAndTasks: ["kerio", "herio"],
        },
      ],
      technicalSkills: [
        {
          skillName: "Tarashkari",
          skillProficiency: "Very Skilled",
          skillImportance: "Side Hustle",
        },
      ],
      softwareSkills: [
        {
          softwareName: "Taarashkari",
          skillProficiency: "Very Skilled",
          skillImportance: "Side Hustle",
        },
      ],
      degrees: [
        { almaMater: "Harvard", degree: "Dbiploma", dateEarned: "2013" },
      ],
      certifications: [
        {
          certName: "C+",
          grantedBy: "Ario",
          dateEarned: "2031",
          dateExpires: "2015",
        },
      ],
      awardsAchievements: [
        {
          awardName: "Oscards",
          awardCompany: "The Academy",
          dateEarned: "2002",
        },
      ],
      volunteering: [
        {
          orgName: "RedCrsoss",
          tasksCompleted: ["Fiobio", "Riobio"],
          dates: ["20213", "2014"],
        },
      ],
    });

    const resumeDoc = await resume.save();
    resumeId = resumeDoc._id;
  });

  it("it should render the resume", function (done) {
    chai
      .request(server)
      .post(`/render/${resumeId}/template1`)
      .set("x-auth-token", token)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        console.log(res.body);
        done();
      });
  });
});
