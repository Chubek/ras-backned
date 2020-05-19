process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const Resume = require("../modules/resume/model");
const signInAndGetToken = require("./firebase").signInAndGetToken;
const firebase = require("./firebase");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const expect = require("chai").expect;
const admin = require("firebase-admin");

chai.use(chaiHttp);
describe("Resume", function () {
  let token;
  let userId;
  let id;
  before(async function () {
    await Resume.deleteMany({});
    token = await signInAndGetToken("aurlito@riseup.net", "H3ll0W0rld");
    userId = await admin.auth().verifyIdToken(token);
  });
  describe("Post Test", function () {
    it("it should create the resumes", function (done) {
      chai
        .request(server)
        .post("/resume/create")
        .set("x-auth-token", token)
        .send({ resumeName: "Test Resume" })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body.resumeId).to.not.be.null;
          done();
        });
    });
  });
  describe("Put tests", function () {
    before(async function () {
      const resumes = await Resume.find({});
      id = resumes[0]._id;
    });
    it("it should set resume contacts", function (done) {
      chai
        .request(server)
        .put(`/resume/set/contacts/${id}`)
        .set("x-auth-token", token)
        .send({
          firstName: "John",
          lastName: "Lithgaw",
          phoneNumber: "555-555-1234",
          emailAddress: "chubak@bidpaa.com",
          city: "Palermo",
          state: "DE - Delaware",
          zipCode: "70255᠎9665",
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("resumeUpdated");
          expect(res.body.resumeUpdated).to.be.true;
          done();
        });
    });
    it("it should set resume summary", function (done) {
      chai
        .request(server)
        .put(`/resume/set/summary/${id}`)
        .set("x-auth-token", token)
        .send({
          objective: "Coolio",
          summary: "Hellio",
          bluf: "Wellio",
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("resumeUpdated");
          expect(res.body.resumeUpdated).to.be.true;
          done();
        });
    });
    it("it should set resume history", function (done) {
      chai
        .request(server)
        .put(`/resume/append/history/${id}`)
        .set("x-auth-token", token)
        .send({
          companyName: "Carmen Santiago Ltd",
          location: "Jerusalem",
          datesFrom: "2012",
          datesTo: "2016",
          dutiesAndTasks: ["Killing a Mockingbird", "Killing a mockingjay"],
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("resumeUpdated");
          expect(res.body.resumeUpdated).to.be.true;
          done();
        });
    });
    it("it should set resume tech skills", function (done) {
      chai
        .request(server)
        .put(`/resume/append/techskills/${id}`)
        .set("x-auth-token", token)
        .send({
          skillName: "Freaking A",
          skillProficiency: "Skilled Enough",
          skillImportance: "Side Hustle",
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("resumeUpdated");
          expect(res.body.resumeUpdated).to.be.true;
          done();
        });
    });
    it("it should set resume history", function (done) {
      chai
        .request(server)
        .put(`/resume/append/history/${id}`)
        .set("x-auth-token", token)
        .send({
          companyName: "Carmen Santiago Ltd",
          location: "Jerusalem",
          datesFrom: "2012",
          datesTo: "2016",
          dutiesAndTasks: ["Killing a Mockingbird", "Killing a mockingjay"],
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("resumeUpdated");
          expect(res.body.resumeUpdated).to.be.true;
          done();
        });
    });
    it("it should set resume software skills", function (done) {
      chai
        .request(server)
        .put(`/resume/append/softwareskills/${id}`)
        .set("x-auth-token", token)
        .send({
          softwareName: "Microsoft Lotus",
          skillProficiency: "Skilled Enough",
          skillImportance: "Side Hustle",
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("resumeUpdated");
          expect(res.body.resumeUpdated).to.be.true;
          done();
        });
    });
    it("it should set resume degrees", function (done) {
      chai
        .request(server)
        .put(`/resume/append/degrees/${id}`)
        .set("x-auth-token", token)
        .send({
          almaMater: "Terran Killam U",
          degree: "PhD",
          dateEarned: "2001",
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("resumeUpdated");
          expect(res.body.resumeUpdated).to.be.true;
          done();
        });
    });
    it("it should set resume certs", function (done) {
      chai
        .request(server)
        .put(`/resume/append/certs/${id}`)
        .set("x-auth-token", token)
        .send({
          certName: "A+",
          grantedBy: "A Company",
          dateEarned: "2012",
          dateExpires: "2026",
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("resumeUpdated");
          expect(res.body.resumeUpdated).to.be.true;
          done();
        });
    });
    it("it should set resume awards", function (done) {
      chai
        .request(server)
        .put(`/resume/append/awards/${id}`)
        .set("x-auth-token", token)
        .send({
          awardName: "Hill Street Blues",
          awardCompany: "Kaltex Records",
          dateEarned: "24/12",
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("resumeUpdated");
          expect(res.body.resumeUpdated).to.be.true;
          done();
        });
    });
    it("it should set resume volunteerings", function (done) {
      chai
        .request(server)
        .put(`/resume/append/volunteering/${id}`)
        .set("x-auth-token", token)
        .send({
          orgName: "Killer Bee Lrd.",
          tasksCompleted: ["Killing Bees", "Killings Wasps", "Killing WASPs"],
          dates: ["2012", "20123"],
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("resumeUpdated");
          expect(res.body.resumeUpdated).to.be.true;
          done();
        });
    });
  });
  describe("Put del/edit", function () {
    before(async function () {
      const resumes = await Resume.find({});
      id = resumes[0]._id;
    });
    it("it should edit resume history", function (done) {
      chai
        .request(server)
        .put(`/resume/append/history/${id}`)
        .set("x-auth-token", token)
        .send({
          companyName: "Carmen Santiago Ltd",
          location: "Jerusalem",
          datesFrom: "2012",
          datesTo: "2016",
          dutiesAndTasks: ["Killing a Mockingbird", "Killing a mockingjay"],
          edit: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexUpdated");
          expect(res.body.indexUpdated).to.equal(0);
          done();
        });
    });
    it("it should edit resume tech skills", function (done) {
      chai
        .request(server)
        .put(`/resume/append/techskills/${id}`)
        .set("x-auth-token", token)
        .send({
          skillName: "Freaking A",
          skillProficiency: "Skilled Enough",
          skillImportance: "Side Hustle",
          edit: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexUpdated");
          expect(res.body.indexUpdated).to.equal(0);
          done();
        });
    });
    it("it should edit resume history", function (done) {
      chai
        .request(server)
        .put(`/resume/append/history/${id}`)
        .set("x-auth-token", token)
        .send({
          companyName: "Carmen Santiago Ltd",
          location: "Jerusalem",
          datesFrom: "2012",
          datesTo: "2016",
          dutiesAndTasks: ["Killing a Mockingbird", "Killing a mockingjay"],
          edit: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexUpdated");
          expect(res.body.indexUpdated).to.equal(0);
          done();
        });
    });
    it("it should edit resume software skills", function (done) {
      chai
        .request(server)
        .put(`/resume/append/softwareskills/${id}`)
        .set("x-auth-token", token)
        .send({
          softwareName: "Microsoft Lotus",
          skillProficiency: "Skilled Enough",
          skillImportance: "Side Hustle",
          edit: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexUpdated");
          expect(res.body.indexUpdated).to.equal(0);
          done();
        });
    });
    it("it should edit resume degrees", function (done) {
      chai
        .request(server)
        .put(`/resume/append/degrees/${id}`)
        .set("x-auth-token", token)
        .send({
          almaMater: "Terran Killam U",
          degree: "PhD",
          dateEarned: "2001",
          edit: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexUpdated");
          expect(res.body.indexUpdated).to.equal(0);
          done();
        });
    });
    it("it should edit resume certs", function (done) {
      chai
        .request(server)
        .put(`/resume/append/certs/${id}`)
        .set("x-auth-token", token)
        .send({
          certName: "A+",
          grantedBy: "A Company",
          dateEarned: "2012",
          dateExpires: "2026",
          edit: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexUpdated");
          expect(res.body.indexUpdated).to.equal(0);
          done();
        });
    });
    it("it should edit resume awards", function (done) {
      chai
        .request(server)
        .put(`/resume/append/awards/${id}`)
        .set("x-auth-token", token)
        .send({
          awardName: "Hill Street Blues",
          awardCompany: "Kaltex Records",
          dateEarned: "24/12",
          edit: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexUpdated");
          expect(res.body.indexUpdated).to.equal(0);
          done();
        });
    });
    it("it should edit resume volunteerings", function (done) {
      chai
        .request(server)
        .put(`/resume/append/volunteering/${id}`)
        .set("x-auth-token", token)
        .send({
          orgName: "Killer Bee Lrd.",
          tasksCompleted: ["Killing Bees", "Killings Wasps", "Killing WASPs"],
          dates: ["2012", "20123"],
          edit: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexUpdated");
          expect(res.body.indexUpdated).to.equal(0);
          done();
        });
    });
    it("it should delete resume history", function (done) {
      chai
        .request(server)
        .put(`/resume/append/history/${id}`)
        .set("x-auth-token", token)
        .send({
          companyName: "Carmen Santiago Ltd",
          location: "Jerusalem",
          datesFrom: "2012",
          datesTo: "2016",
          dutiesAndTasks: ["Killing a Mockingbird", "Killing a mockingjay"],
          delete: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexDeleted");
          expect(res.body.indexDeleted).to.equal(0);
          done();
        });
    });
    it("it should delete resume tech skills", function (done) {
      chai
        .request(server)
        .put(`/resume/append/techskills/${id}`)
        .set("x-auth-token", token)
        .send({
          skillName: "Freaking A",
          skillProficiency: "Skilled Enough",
          skillImportance: "Side Hustle",
          delete: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexDeleted");
          expect(res.body.indexDeleted).to.equal(0);
          done();
        });
    });
    it("it should delete resume history", function (done) {
      chai
        .request(server)
        .put(`/resume/append/history/${id}`)
        .set("x-auth-token", token)
        .send({
          companyName: "Carmen Santiago Ltd",
          location: "Jerusalem",
          datesFrom: "2012",
          datesTo: "2016",
          dutiesAndTasks: ["Killing a Mockingbird", "Killing a mockingjay"],
          delete: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexDeleted");
          expect(res.body.indexDeleted).to.equal(0);
          done();
        });
    });
    it("it should delete resume software skills", function (done) {
      chai
        .request(server)
        .put(`/resume/append/softwareskills/${id}`)
        .set("x-auth-token", token)
        .send({
          softwareName: "Microsoft Lotus",
          skillProficiency: "Skilled Enough",
          skillImportance: "Side Hustle",
          delete: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexDeleted");
          expect(res.body.indexDeleted).to.equal(0);
          done();
        });
    });
    it("it should delete resume degrees", function (done) {
      chai
        .request(server)
        .put(`/resume/append/degrees/${id}`)
        .set("x-auth-token", token)
        .send({
          almaMater: "Terran Killam U",
          degree: "PhD",
          dateEarned: "2001",
          delete: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexDeleted");
          expect(res.body.indexDeleted).to.equal(0);
          done();
        });
    });
    it("it should delete resume certs", function (done) {
      chai
        .request(server)
        .put(`/resume/append/certs/${id}`)
        .set("x-auth-token", token)
        .send({
          certName: "A+",
          grantedBy: "A Company",
          dateEarned: "2012",
          dateExpires: "2026",
          delete: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexDeleted");
          expect(res.body.indexDeleted).to.equal(0);
          done();
        });
    });
    it("it should delete resume awards", function (done) {
      chai
        .request(server)
        .put(`/resume/append/awards/${id}`)
        .set("x-auth-token", token)
        .send({
          awardName: "Hill Street Blues",
          awardCompany: "Kaltex Records",
          dateEarned: "24/12",
          delete: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexDeleted");
          expect(res.body.indexDeleted).to.equal(0);
          done();
        });
    });
    it("it should delete resume volunteerings", function (done) {
      chai
        .request(server)
        .put(`/resume/append/volunteering/${id}`)
        .set("x-auth-token", token)
        .send({
          orgName: "Killer Bee Lrd.",
          tasksCompleted: ["Killing Bees", "Killings Wasps", "Killing WASPs"],
          dates: ["2012", "20123"],
          delete: "true",
          index: 0,
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("indexDeleted");
          expect(res.body.indexDeleted).to.equal(0);
          done();
        });
    });
  });
  describe("Gets", function () {
    before(async function () {
      const resume = new Resume({
        "createdInfo.userId": userId.uid,
        "createdInfo.resumeName": "Resume Two",
      });

      await resume.save();
    });
    it("it should get all the resumes by user", function (done) {
      chai
        .request(server)
        .get("/resume/get/all")
        .set("x-auth-token", token)
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("resumeDocs");
          expect(res.body.resumeDocs).to.be.an("array");
          done();
        });
    });
    it("it should get a single resume", function (done) {
      chai
        .request(server)
        .get(`/resume/get/single/${id}`)
        .set("x-auth-token", token)
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("resumeDoc");
          expect(res.body.resumeDoc).to.be.an("object");
          done();
        });
    });
  });
  describe("Restore", function () {
    let restoreId;
    before(async function () {
      const doc = await Resume.find({});
      restoreId = doc[0].editCaptures[2]._id;
    });
    it("it should test the edit capture data", function (done) {
      chai
        .request(server)
        .put(`/resume/restore/to/capture/${id}`)
        .set("x-auth-token", token)
        .send({ restoreId: restoreId })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body).to.have.property("resumeRestored");
          expect(res.body).to.have.property("resumeDoc");
          expect(res.body.resumeRestored).to.be.true;
          done();
        });
    });
  });
});
