/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com --- April 2020, Corona Times */

require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const colors = require("colors");
const admin = require("firebase-admin");
var serviceAccount = require("../services/googleAdmin/google-services-test.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https:/resumeasservice.firebaseio.com",
});

const app = express();

global.appRoot = path.resolve(__dirname);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

mongoose
  .connect("mongodb://localhost:27017/resume-as-service-test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB Connected".green.inverse))
  .catch((e) => console.error(`${e}`.underline.red));
mongoose.set("useFindAndModify", false);

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/resume", require("../modules/resume/route"));

/*app.get("/", function(req, res) {
res.sendFile("index.html", { root: path.join(__dirname, "dist") });
});*/

const port = 5059;

app.listen(port, () =>
  console.log(`Server started on port ${port}`.blue.inverse)
);

module.exports = app;
