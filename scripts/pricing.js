import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";

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
const analytics = getAnalytics(app);
