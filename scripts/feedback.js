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

// Reference to the form element
const form = document.getElementById('feedbackForm');

// Event listener for form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Get input values from the form
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;

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
});
