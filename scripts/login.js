import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getDatabase, ref, update, get } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";

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

const loginbtn = document.getElementById("login-btn");

loginbtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  if (!validate_email(email) || !validate_password(password)) {
    return;
  }
  
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userRef = ref(database, 'users/' + user.uid);

      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const userName = userData.name || 'User';
            
            const user_data = {
              last_login: Date.now()
            };
            update(userRef, user_data);
            
            alert(`Welcome back, ${userName}.`);
            window.location.href = "../index.html";
          } else {
            alert("User data not found.");
          }
        })
        .catch((error) => {
          var error_message = error.message;
          alert("Error fetching user data:", error.message);
          return;
        });
    })
    .catch((error) => {
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
