import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
  import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const signUpBtn = document.getElementById('submit');
  const notLogged = document.getElementById('not-logged-in');
  const logged = document.getElementById('logged-in');
  const fill = document.getElementById("fill");
  onAuthStateChanged(auto, (user) => {

  if (user){
    notLogged.style.display = "none";
    logged.style.display = "block";
    fill.innerHTML = user.email;
 } else {
  notLogged.style.display = "block";
  logged.style.display = "none";
 }
  });

  const signUpBtnPressed = async (e) => {
    e.preventDefault();

    try {
     const userCredential =  await createUserWithEmailAndPassword(auth, email.value, password.value);
     alert(userCredential);
    } catch (error) {
      alert("error");
    }
  };

  signUpBtn.addEventListener("click", signUpBtnPressed);