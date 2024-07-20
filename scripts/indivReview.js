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
let prof = '../images/pfp.png';
let username = "Anonymous";

function getCurrentTimestamp() {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function checkUserLoggedIn() {
    const loginbtn = document.querySelector(".login-btn");
    const profDiv = document.getElementById("profile-pic");;
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    username = userData.name;
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

checkUserLoggedIn();

document.getElementById('input_button').addEventListener('click', function() {
    const replyContent = document.getElementById('input_reply').value.trim();

    if (replyContent !== '') {
        const params = new URLSearchParams(window.location.search);
        const key = params.get('key');
        
        const repliesRef = ref(database, `unfinished_task/${key}/replies`);
        const newReplyRef = push(repliesRef);

        const replyData = {
            content: DOMPurify.sanitize(replyContent),
            user: username,
            timestamp: getCurrentTimestamp()
        };

        update(newReplyRef, replyData)
            .then(function() {
                console.log('Reply added successfully');
                document.getElementById('input_reply').value = '';
            })
            .catch(function(error) {
                console.error('Error adding reply: ', error);
                alert('Failed to add reply. Please try again.');
            });
    } else {
        alert('Please enter a reply before submitting.');
    }
});

function fetchReplies() {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');
    
    const repliesRef = ref(database, `unfinished_task/${key}/replies`);

    onValue(repliesRef, function(snapshot) {
        const repliesContainer = document.getElementById('unfinished_tasks_container');
        repliesContainer.innerHTML = ''; // Clear previous content safely

        snapshot.forEach(function(childSnapshot) {
            const reply = childSnapshot.val();

            // Sanitize each piece of dynamic content
            const sanitizedUser = DOMPurify.sanitize(reply.user);
            const sanitizedTimestamp = DOMPurify.sanitize(reply.timestamp);
            const sanitizedContent = DOMPurify.sanitize(reply.content);

            // Create elements programmatically
            const replyElement = document.createElement('div');
            replyElement.classList.add('reply');

            const userElement = document.createElement('div');
            userElement.classList.add('reply-user');
            userElement.textContent = sanitizedUser;

            const timestampElement = document.createElement('div');
            timestampElement.classList.add('reply-timestamp');
            timestampElement.textContent = sanitizedTimestamp;

            const contentElement = document.createElement('div');
            contentElement.classList.add('reply-content');
            contentElement.textContent = sanitizedContent;

            replyElement.appendChild(userElement);
            replyElement.appendChild(timestampElement);
            replyElement.appendChild(contentElement);

            repliesContainer.appendChild(replyElement);
        });
    }, function(error) {
        console.error('Error fetching replies: ', error);
        alert('Failed to fetch replies. Please try again.');
    });
}


fetchReplies();
