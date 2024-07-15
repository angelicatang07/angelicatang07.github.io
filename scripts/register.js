// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBQ1TcCHByOmGBpPNaO9jfOg7T9pVfSFFU",
    authDomain: "the-website-c2fc0.firebaseapp.com",
    databaseURL: "https://the-website-c2fc0-default-rtdb.firebaseio.com",
    projectId: "the-website-c2fc0",
    storageBucket: "the-website-c2fc0.appspot.com",
    messagingSenderId: "250867055712",
    appId: "1:250867055712:web:745853ebb86ae8e3801705",
    measurementId: "G-9E81W0H16Z"
  };  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

function checkUserLoggedIn() {
    const loginbtn = document.querySelector(".login-btn");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            loginbtn.style.display = "none"; // Hide login button if user is logged in
        } else {
            loginbtn.style.display = "block"; // Show login button if user is not logged in
        }
    });
}

checkUserLoggedIn();

const registerbtn = document.getElementById("register-btn");

registerbtn.addEventListener("click", () => {
  const name = document.getElementById("full_name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  if (!validate_email(email) || !validate_password(password)) {
    window.alert("Password must be at least 6 characters and email must be valid.");
    return;
  }
  if (!validate_field(name)) {
    window.alert("Please enter your name");
    return;
  }
  
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const database_ref = ref(database, 'users/' + user.uid);
      const user_data = {
        email: email,
        name: name,
        last_login: Date.now()
      };
      
      update(database_ref, user_data);
      
      alert(`Welcome, ${user_data.name}`);
      window.location.href = "../index.html";
    })
    .catch(error => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
});

function validate_email(email) {
  const rgx = /^[^@]+@\w+(\.\w+)+\w$/;
  return rgx.test(email);
}

function validate_password(pass) {
  return pass.length >= 6;
}

function validate_field(field) {
  return field && field.trim().length > 0;
}
