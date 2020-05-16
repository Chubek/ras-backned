process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const Resume = require("../modules/resume/model");
const signInAndGetToken = require("./firebase").signInAndGetToken;
const firebase = require("./firebase");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const expect = require("chai").expect;

chai.use(chaiHttp);
describe("Resume", function () {
  let token;
  before(async function () {
    token = await signInAndGetToken("aurlito@riseup.net", "H3ll0W0rld");
  });
  describe("GETS", function () {
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
});
