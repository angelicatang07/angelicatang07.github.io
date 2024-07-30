import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getDatabase, ref, push, update, remove, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
let prof = '../images/pfp.png';

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
                }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
        } else {
            window.location.href = "../index.html"; }
    });
}


const form = document.getElementById('subscriptionForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('email');
    const email = document.getElementById('email').value;
   
    if (!validate_email(email)) {
        alert('Invalid Email.');
        emailInput.focus(); // Set focus to the email input field
        return;
    }
    try {
        // Add a new document with email and timestamp to 'mailing' collection
        const docRef = await addDoc(collection(db, 'mailing'), {
            email: email,
            timestamp: serverTimestamp()
        });

        console.log('Document written with ID: ', docRef.id);
        alert('Subscription successful!');
        form.reset(); // Reset form fields

        // You may call a function here to update UI or display subscriptions
        // displaySubscriptions(); // Uncomment this if you have a function to display subscriptions
    } catch (error) {
        console.error('Error adding document: ', error);
        alert('Subscription failed. Please try again later.');
    }

});

function validate_email(email) {
    const rgx = /^[^@]+@\w+(\.\w+)+\w$/;
    return rgx.test(email);
  }

checkUserLoggedIn();

const sign_out = document.getElementById('sign-out');
sign_out.addEventListener('click', () => {
  
    signOut(auth).then(() => {
        alert("logging out");
        window.location.href = "../index.html";

    }).catch((error) => {
       console.log('error');
    });
    
})