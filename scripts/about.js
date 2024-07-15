// Import necessary Firebase modules using ES module syntax
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";
import { getDatabase, ref, push, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

// Firebase configuration object with your project's credentials
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
const db = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);

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

// Get reference to the subscription form
const form = document.getElementById('subscriptionForm');

// Event listener for form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.email.value;

  try {
    // Add a new document with email and timestamp to 'mailing' collection
    const docRef = await addDoc(collection(db, 'mailing'), {
      email: email,
      timestamp: serverTimestamp()
    });
    console.log('Document written with ID: ', docRef.id);
    alert('Subscription successful!');
    form.reset(); // Reset form fields
    displaySubscriptions(); // Refresh list after successful submission
  } catch (error) {
    console.error('Error adding document: ', error);
    alert('Subscription failed. Please try again later.');
  }
});