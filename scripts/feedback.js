import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBQ1TcCHByOmGBpPNaO9jfOg7T9pVfSFFU",
    authDomain: "the-website-c2fc0.firebaseapp.com",
    databaseURL: "https://the-website-c2fc0-default-rtdb.firebaseio.com",
    projectId: "the-website-c2fc0",
    storageBucket: "the-website-c2fc0.appspot.com",
    messagingSenderId: "250867055712",
    appId: "1:250867055712:web:745853ebb86ae8e3801705",
    measurementId: "G-KBZ3ZQRVHB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase();
let prof = '../images/pfp.png';

// Reference to the form element
const form = document.getElementById('feedbackForm');
function checkUserLoggedIn() {
    const loginbtn = document.querySelector(".login-btn");
    const profDiv = document.getElementById("profile-pic");;
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    prof = userData.profile_picture;
                } else {
                    console.log("No user data found");
                }
                profDiv.src = prof;
                profDiv.style.display = "block";
                loginbtn.style.display = "none"; // Hide login button if user is logged in
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
        } else {
            profDiv.style.display = "none";
            loginbtn.style.display = "block"; // Show login button if user is not logged in
        }
    });
}
// Event listener for form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const emailInput = document.getElementById('email');
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;
    if(!validate_email(email)) {
        alert('Invalid Email.');
        return;
    }
    try {
        // Add a new document with email, feedback, and timestamp to 'feedbackCollection'
        const docRef = await addDoc(collection(db, 'feedbackCollection'), {
            email: email,
            feedback: feedback,
            timestamp: serverTimestamp()
        });

        console.log('Document written with ID: ', docRef.id);
        window.alert('Submission successful!');
        form.reset(); // Reset form fields after successful submission

        // Optionally, update UI or perform other actions after submission
        // displaySubscriptions(); // Uncomment this if you have a function to display subscriptions
    } catch (error) {
        console.error('Error adding document: ', error);
        alert('Submission failed. Please try again later.');
    }

    if (!validate_email(email)) {
        alert('Invalid Email.');
        emailInput.focus(); // Set focus to the email input field
        return;
    }
});


function validate_email(email) {
    const rgx = /^[^@]+@\w+(\.\w+)+\w$/;
    return rgx.test(email);
  }

checkUserLoggedIn();