
const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

function setUp() {
  const firebaseConfig = {
    apiKey: "AIzaSyAZAHhxgjG5TDWdsGCiIfwvNf5oq5btQr8",
    authDomain: "resumeasservice.firebaseapp.com",
    databaseURL: "https://resumeasservice.firebaseio.com",
    projectId: "resumeasservice",
    storageBucket: "resumeasservice.appspot.com",
    messagingSenderId: "999924757036",
    appId: "1:999924757036:web:33ea9af95598fe39bf9789",
    measurementId: "G-X6QD6Q5RLG",
  };

  firebase.initializeApp(firebaseConfig);
}

function signUp(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function (error) {
      console.error(error);
    });
}

async function signIn(email, password) {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => resolve("loggedIn"))
      .catch(function (error) {
        reject(error);
        console.error(error);
      });
  });
}

function getToken() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user
          .getIdToken(true)
          .then((idToken) => {
            resolve(idToken);
          })
          .catch((e) => reject(e));
      } else {
        console.error("No user signed in.");
      }
    });
  });
}

async function signInAndGetToken(email, password) {
  setUp();
  await signIn(email, password);
  return await getToken();
}

exports.setUp = setUp;
exports.signIn = signIn;
exports.getToken = getToken;
exports.signUp = signUp;
exports.signInAndGetToken = signInAndGetToken;
