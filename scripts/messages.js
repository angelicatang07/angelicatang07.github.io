import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, push, update, get, onValue } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import DOMPurify from 'https://cdn.skypack.dev/dompurify';

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
const database = getDatabase(app);
const auth = getAuth(app);
let username = "Anonymous";
let email = "";

function checkUserLoggedIn() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    username = userData.name;
                    email = userData.email;
                } else {
                    console.log("No user data found");
                }
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
        } else {
            console.log("No user is logged in");
        }
    });
}

checkUserLoggedIn();

const form = document.getElementById("send-message");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const globalChatRef = ref(database, 'global_chat'); 
    const newMessageRef = push(globalChatRef);
    const date = formatDate(new Date());
    const message = document.getElementById("message").value;
    
    update(newMessageRef, {
        sender: username,
        sender_email: email,
        message: message,
        date: date,
    }).then(() => {
        document.getElementById("message").value = ""; 
    }).catch(error => {
        console.error("Error sending message: ", error);
    });
});

const messagesRef = ref(database, 'global_chat');
onValue(messagesRef, (snapshot) => {
    const messagesList = document.getElementById("messages");
    messagesList.innerHTML = ''; // Clear current messages

    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const sanitizedMessage = DOMPurify.sanitize(data.message); // Sanitize message

        const listItem = document.createElement('li');
        listItem.classList.add(data.sender_email === email ? 'my-message' : 'other-message');
        
        listItem.innerHTML = `
            <strong>${data.sender}</strong>
            <span class="message-date">${data.date}</span><br>
            <span class="message-body">${sanitizedMessage}</span>
        `;
      
        messagesList.appendChild(listItem);
    });
});

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}
