 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
 import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
 import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
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

 const app = initializeApp(firebaseConfig);
 const db = getDatabase(app);
 const auth = getAuth(app);
 const signUpBtn = document.getElementById('submit');

 signUpBtn.addEventListener('click', (e) => {
  e.preventDefault();
var email= document.getElementById('email').value;
var password = document.getElementById('password').value;
var notLoggedIn = document.getElementById("not-logged-in");
var loggedIn = document.getElementById("logged-in");


    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      set(ref(db), 'users/' + user.uid, {
        email: email
      });
      alert("user created");
      loggedIn.style.display = 'block';
      notLoggedIn.style.display = 'none';
      // ...
    })
    .catch((error) => {
      const errorMessage = error.message;
        alert(errorMessage);
      loggedIn.style.display = 'none';
      notLoggedIn.style.display = 'block';
      // ..
    });
 });

 