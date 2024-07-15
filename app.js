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
    measurementId: "G-9E81W0H16Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
let username = 'Anonymous';

function checkUserLoggedIn() {
    const loginbtn = document.querySelector(".login-btn");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    username = userData.name || 'User';
                } else {
                    console.log("No user data found");
                }
                loginbtn.style.display = "none"; // Hide login button if user is logged in
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
        } else {
            loginbtn.style.display = "block"; // Show login button if user is not logged in
        }
    });
}

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
    onValue(unfinishedTaskRef, (snapshot) => {
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

// Helper function to create task HTML element
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

    const date = document.createElement('p');
    date.setAttribute('class', 'task_date');
    date.textContent = task.date;

    // Task tools
    const taskTool = document.createElement('div');
    taskTool.setAttribute('class', 'task_tool');

    const taskDeleteButton = document.createElement('button');
    taskDeleteButton.setAttribute('class', 'task_delete_button');
    taskDeleteButton.innerHTML = '<i class="bx bx-trash" style="cursor:pointer"></i>';
    taskDeleteButton.classList.add('cursor-pointer');
    taskDeleteButton.addEventListener('click', () => {
        if (type === 'unfinished') {
            task_delete(key); // Pass the key to the delete function
        }
    });

    // Append elements
    taskTool.appendChild(taskDeleteButton);
    taskData.appendChild(title);
    taskData.appendChild(date);
    taskData.appendChild(creator);
    taskData.appendChild(review);
    taskContainer.appendChild(taskData);
    taskContainer.appendChild(taskTool);

    return taskContainer;
}

// Function to delete task
function task_delete(key) {
    const taskRef = ref(database, 'unfinished_task/' + key);

    // Remove task from database
    remove(taskRef).then(() => {
        // Task successfully deleted
        console.log("Task deleted successfully");
        // Remove task from UI
        const taskElement = document.querySelector(`.task_container[data-key="${key}"]`);
        if (taskElement) {
            taskElement.remove();
        }
    }).catch(error => {
        console.error("Error removing task: ", error);
    });
}

// Function to format date as "Month Day, Year"
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Initial load of tasks
create_unfinished_task();
