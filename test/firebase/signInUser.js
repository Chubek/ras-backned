const signIn = require("./index").signIn;
const setUp = require("./index").setUp;

setUp();

const args = process.argv.slice(2);

console.log(args);
console.log(process.argv);

signIn(args[0], args[1]);
