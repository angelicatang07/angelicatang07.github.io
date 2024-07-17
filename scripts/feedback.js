import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";

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
const db = getFirestore(app);

const form = document.getElementById('feedbackForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;
    try {
        // Add a new document with email and timestamp to 'mailing' collection
        const docRef = await addDoc(collection(db, 'feedbackCollection'), {
            email: email,
            feedback: feedback,
            timestamp: serverTimestamp()
        });

        console.log('Document written with ID: ', docRef.id);
        alert('Submission successful!');
        form.reset(); // Reset form fields

        // You may call a function here to update UI or display subscriptions
        // displaySubscriptions(); // Uncomment this if you have a function to display subscriptions
    } catch (error) {
        console.error('Error adding document: ', error);
        alert('Submission failed. Please try again later.');
    }
});
