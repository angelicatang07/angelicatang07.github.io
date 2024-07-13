import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getDatabase} from 'firebase/database';
import { getAuth, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLCTKoWoxtvyZIGqzegq1l2jZL3g9jqWw",
  authDomain: "ledgit-website-83db1.firebaseapp.com",
  databaseURL: "https://ledgit-website-83db1-default-rtdb.firebaseio.com",
  projectId: "ledgit-website-83db1",
  storageBucket: "ledgit-website-83db1.appspot.com",
  messagingSenderId: "839227429175",
  appId: "1:839227429175:web:963536f0b5309d59e8cab2",
  measurementId: "G-09H5HGCLYL"
};

firebase.initializeApp(firebaseConfig);

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    var notLoggedIn = document.getElementById("not-logged-in");
    var loggedIn = document.getElementById("logged-in");
  if (user) {
    loggedIn.style.display = "block"
    notLoggedIn.style.display = "none"
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    loggedIn.style.display = "none"
    notLoggedIn.style.display = "block"
  }
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function login(event) {
    event.preventDefault();

}

function logout(event) {
    event.preventDefault();
}