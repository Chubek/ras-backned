const signUp = require("./index").signUp;
const setUp = require("./index").setUp;

setUp();

const args = process.argv.slice(2);

signUp(args[0], args[1]);
