import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, push, update, onValue } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

function getCurrentTimestamp() {
    const now = new Date();
    return now.toLocaleString(); // Adjust format as needed
}

// Event listener for submit button
document.getElementById('input_button').addEventListener('click', function() {
    const replyContent = document.getElementById('input_reply').value.trim();

    if (replyContent !== '') {
        const params = new URLSearchParams(window.location.search);
        const key = params.get('key');
        
        const repliesRef = ref(database, `unfinished_task/${key}/replies`);
        const newReplyRef = push(repliesRef); // Generate a new unique key for the reply

        const replyData = {
            content: replyContent,
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

// Function to fetch and display replies
function fetchReplies() {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');
    
    const repliesRef = ref(database, `unfinished_task/${key}/replies`);

    onValue(repliesRef, function(snapshot) {
        const repliesContainer = document.getElementById('unfinished_tasks_container');
        repliesContainer.innerHTML = ''; // Clear previous content

        snapshot.forEach(function(childSnapshot) {
            const reply = childSnapshot.val();
            const replyElement = document.createElement('div');
            replyElement.classList.add('reply');
            replyElement.innerHTML = `
                <p>${reply.content}</p>
                <p>Timestamp: ${reply.timestamp}</p>
            `;
            repliesContainer.appendChild(replyElement);
        });
    }, function(error) {
        console.error('Error fetching replies: ', error);
        alert('Failed to fetch replies. Please try again.');
    });
}

// Call fetchReplies function to load existing replies when the page loads
fetchReplies();
