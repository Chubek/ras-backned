process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const ResumeSchema = require("../modules/resume/model");
const signIn = require("./firebase").signIn;
const getToken = require("./firebase").getToken;

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();

chai.use(chaiHttp);
describe("Resume", () => {
  before((done) => {
    signIn("aurlito@riseup.net", "T3stP4ssw0rd");
    this.token = getToken();
    done();
  });
  beforeEach((done) => {
    ResumeSchema.remove({}, (err) => {
      done();
    });
  });
  describe("GETS", () => {
      it("it should get all the resumes", done => {
          chai.request(server)
            .get()
    });
  });
});
