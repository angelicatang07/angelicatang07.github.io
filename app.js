// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
let username = 'Anonymous';
let prof = 'images/pfp.png';

function checkUserLoggedIn() {
    const loginbtn = document.querySelector(".login-btn");
    const profDiv = document.getElementById("profile-pic");;
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    username = userData.name || 'Anonymous';
                    prof = userData.profile_picture || '../images/pfp.png';
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

document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    const message = document.getElementById('message');
  
    let rating = 0; // Initialize rating variable

    stars.forEach(star => {
        star.addEventListener('click', function() {
            rating = parseInt(star.getAttribute('data-star'));
            message.textContent = `You rated this ${rating} stars.`;
            stars.forEach(s => s.classList.remove('active'));
            star.classList.add('active');
        });
    });

    const submitButton = document.getElementById("input_button");
    submitButton.addEventListener("click", () => {
        const inputBox = document.getElementById("input_box");
        const inputRev = document.getElementById("input_review");
        const title = inputBox.value.trim();
        const rev = inputRev.value.trim();
        const date = formatDate(new Date()); // Get current date in readable format
    
        if (title.length === 0 || rev.length === 0 || rating === 0) {
            alert("Please fill in all fields and rate the book.");
            return;
        }
    
        // Add task to database
        const newTaskRef = push(unfinishedTaskRef);
        update(newTaskRef, {
            title: title,
            creator: username, // Ensure creator name is added
            review: rev,
            stars: rating,
            date: date
        }).then(() => {
            inputBox.value = "";
            inputRev.value = "";
            create_unfinished_task(); // Refresh task list
            rating = 0; // Reset rating after submission
            stars.forEach(s => s.classList.remove('active')); // Reset star UI
        }).catch(error => {
            console.error("Error adding task: ", error);
        });
    });
});

checkUserLoggedIn();

// Reference to task collections
const unfinishedTaskRef = ref(database, 'unfinished_task');

const submitButton = document.getElementById("input_button");
submitButton.addEventListener("click", () => {
    const inputBox = document.getElementById("input_box");
    const inputRev = document.getElementById("input_review");
    const title = inputBox.value.trim();
    const rev = inputRev.value.trim();
    const date = formatDate(new Date()); // Get current date in readable format

    if (title.length === 0 || rev.length === 0) {
        alert("Please fill in all fields");
        return;
    }

    // Add task to database
    const newTaskRef = push(unfinishedTaskRef);
    update(newTaskRef, {
        title: title,
        creator: username, // Ensure creator name is added
        review: rev,
        stars: rating,
        date: date
    }).then(() => {
        inputBox.value = "";
        inputRev.value = "";
        create_unfinished_task(); // Refresh task list
    }).catch(error => {
        console.error("Error adding task: ", error);
    });
});

// Function to create unfinished tasks
function create_unfinished_task() {
    const unfinishedTaskContainer = document.getElementById("unfinished_tasks_container");

    // Clear existing task containers
    unfinishedTaskContainer.innerHTML = "";

    // Fetch tasks once from Firebase
    onValue(ref(database, 'unfinished_task'), (snapshot) => {
        const tasks = snapshot.val();
        if (tasks) {
            Object.keys(tasks).forEach(key => {
                const task = tasks[key];
                const taskContainer = createTaskElement(task, key, 'unfinished');
                unfinishedTaskContainer.appendChild(taskContainer);
            });
        } else {
            // Handle case where there are no tasks
            console.log("No tasks found");
        }
    }, {
        onlyOnce: true // Fetch data only once
    });
}


function createTaskElement(task, key, type) {
    const taskContainer = document.createElement("div");
    taskContainer.setAttribute("class", "task_container");
    taskContainer.setAttribute("data-key", key);

    // Task data
    const taskData = document.createElement('div');
    taskData.setAttribute('class', 'task_data');

    const title = document.createElement('p');
    title.setAttribute('class', 'task_title');
    title.textContent = task.title;

    const creator = document.createElement('p');
    creator.setAttribute('class', 'task_creator');
    creator.textContent = `Creator: ${task.creator}`;

    const review = document.createElement('p');
    review.setAttribute('class', 'task_review');
    review.textContent = task.review;

    // Create stars container
    const starsContainer = createStarsContainer(task.stars);
    starsContainer.setAttribute('class', 'task_stars');

    const date = document.createElement('p');
    date.setAttribute('class', 'task_date');
    date.textContent = task.date;

    // Add click event listener for redirection
    taskContainer.addEventListener('click', () => {
        // Redirect to indivReview.html with query parameters
        taskContainer.addEventListener('click', () => {
            const queryParams = `?key=${key}&title=${encodeURIComponent(task.title)}&creator=${encodeURIComponent(task.creator)}&review=${encodeURIComponent(task.review)}&date=${encodeURIComponent(task.date)}&stars=${encodeURIComponent(task.stars)}`;
            window.location.href = `screens/indivReview.html${queryParams}`;
        });
          window.location.href = `screens/indivReview.html${queryParams}`;
    });
    

    // Append elements
    taskData.appendChild(title);
    taskData.appendChild(date);
    taskData.appendChild(starsContainer); 
    taskData.appendChild(creator);
    taskData.appendChild(review);
    taskContainer.appendChild(taskData);

    return taskContainer;
}




// Function to delete task
// function task_delete(key) {
//     const taskRef = ref(database, 'unfinished_task/' + key);

//     // Remove task from database
//     remove(taskRef).then(() => {
//         // Task successfully deleted
//         console.log("Task deleted successfully");
//         // Remove task from UI
//         const taskElement = document.querySelector(`.task_container[data-key="${key}"]`);
//         if (taskElement) {
//             taskElement.remove();
//         }
//     }).catch(error => {
//         console.error("Error removing task: ", error);
//     });
// }

// Function to format date as "Month Day, Year"
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Initial load of tasks
create_unfinished_task();


function createStarsContainer(rating) {
    const starsContainer = document.createElement('div');
    starsContainer.classList.add('stars-container');

    // Create filled stars based on rating
    for (let i = 0; i < rating; i++) {
        const star = document.createElement('span');
        star.innerHTML = '&#9733;'; // Star character
        star.classList.add('filled'); // Add filled class
        starsContainer.appendChild(star);
    }

    // Create empty stars for remaining
    for (let i = rating; i < 5; i++) {
        const star = document.createElement('span');
        star.innerHTML = '&#9733;'; // Star character
        star.classList.add('empty'); // Add empty class
        starsContainer.appendChild(star);
    }

    return starsContainer;
}

