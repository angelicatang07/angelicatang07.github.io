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
let email = "";
function checkUserLoggedIn() {
    const loginbtn = document.querySelector(".login-btn");
    const profDiv = document.getElementById("profile-pic");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    username = userData.name || 'Anonymous';
                    email= userData.email;
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

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add('filled');
                } else {
                    s.classList.remove('filled');
                }
            });
            rating = index + 1;
            message.innerText = `You rated this ${rating} stars.`;
        });
    });

    const submitButton = document.getElementById("input_button");

    submitButton.addEventListener("click", () => {
        const inputBox = document.getElementById("input_box");
        const inputRev = document.getElementById("input_review");
        const title = inputBox.value.trim();
        const rev = inputRev.value.trim();
        const date = formatDate(new Date());
        const dataCon = document.getElementById('data');

        if (title.length === 0 || rev.length === 0 || rating === 0) {
            alert("Please fill in all fields and rate the book.");
            return;
        }
    
        const unfinishedTaskRef = ref(database, 'unfinished_task'); // Define Firebase reference
        const newTaskRef = push(unfinishedTaskRef);
    
        update(newTaskRef, {
            title: title,
            creator: username,
            email: email,
            review: rev,
            stars: rating,
            date: date
        }).then(() => {
            inputBox.value = "";
            inputRev.value = "";
            message.innerText = ""; 
            dataCon.innerText = "";
            rating = 0;
            stars.forEach(s => s.classList.remove('filled'));
        }).catch(error => {
            console.error("Error adding task: ", error);
        });
    });
    


    checkUserLoggedIn();
    create_unfinished_task(); 
});

function create_unfinished_task() {
    const unfinishedTaskContainer = document.getElementById("unfinished_tasks_container");
    const unfinishedTaskRef = ref(database, 'unfinished_task');

    onValue(unfinishedTaskRef, (snapshot) => {
        const tasks = snapshot.val();
        if (tasks) {
            unfinishedTaskContainer.innerHTML = "";

            Object.keys(tasks).forEach(key => {
                const task = tasks[key];
                const taskContainer = createTaskElement(task, key, 'unfinished');
                unfinishedTaskContainer.prepend(taskContainer);
            });
        } else {
            console.log("No tasks found");
        }
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

    const taskTool = document.createElement('div');
    taskTool.setAttribute('class', 'task_tool');

    const date = document.createElement('p');
    date.setAttribute('class', 'task_date');
    date.textContent = task.date;

    const taskDeleteButton = document.createElement('button');
    taskDeleteButton.setAttribute('class', 'task_delete_button');
    taskDeleteButton.innerHTML = '<i class="bx bx-trash" style="cursor:pointer"></i>';
    taskDeleteButton.classList.add('cursor-pointer');
    taskDeleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (type === 'unfinished') {
            event.stopPropagation();
            task_delete(key); // Pass the key to the delete function
        } 
    });

    // Fetch book details and update task container
    fetchBookDetails(task.title)
        .then((books) => {
            if (books && books.length > 0) {
                const book = books[0].volumeInfo;
                const authors = book.authors ? book.authors.join(", ") : "Unknown author";
                const imageUrl = book.imageLinks ? book.imageLinks.thumbnail : "images/default-book-cover.jpg";

                const bookCover = document.createElement('img');
                bookCover.setAttribute('class', 'task_book_cover');
                bookCover.setAttribute('src', imageUrl);
                bookCover.setAttribute('alt', task.title);

                // const authorsElement = document.createElement('p');
                // authorsElement.setAttribute('class', 'task_authors');
                // authorsElement.textContent = `Authors: ${authors}`;

                taskData.prepend(bookCover);
                // Add click event listener to navigate to indivReview.html
                taskContainer.addEventListener('click', () => {
                    const queryParams = `?key=${key}&title=${encodeURIComponent(task.title)}&creator=${encodeURIComponent(task.creator)}&email=${encodeURIComponent(task.email)}&review=${encodeURIComponent(task.review)}&date=${encodeURIComponent(task.date)}&stars=${encodeURIComponent(task.stars)}&authors=${encodeURIComponent(authors)}&bookCover=${encodeURIComponent(imageUrl)}`;
                    window.location.href = `screens/indivReview.html${queryParams}`;
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching book details:", error);
        });

        taskTool.prepend(taskDeleteButton);
        taskContainer.prepend(taskTool);
        
        taskData.prepend(review); 
        taskData.prepend(starsContainer);
        taskData.prepend(date); 
        taskData.prepend(creator);
         taskData.prepend(title);
        taskContainer.prepend(taskData);
    


    return taskContainer;
}

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

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

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

async function fetchBookDetails(title) {
    const apiKey = "AIzaSyCu3xGU8I2x9b82CYXb9TdK0TLws0wkx_g"; 
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        return data.items || []; // Return the items array from API response
    } catch (error) {
        console.error("Error fetching book details:", error);
        return [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const inputBox = document.getElementById("input_box");
    const dataContainer = document.getElementById("data");

    inputBox.addEventListener("input", async () => {
        const bookTitle = inputBox.value.trim();

        const books = await fetchBookDetails(bookTitle);

        if (books && books.length > 0) {
            const book = books[0].volumeInfo; // Get the first book's volume info
            const title = book.title;
            const authors = book.authors ? book.authors.join(", ") : "Unknown author";
            const imageUrl = book.imageLinks ? book.imageLinks.thumbnail : "images/default-book-cover.jpg";

            // Display book details in #data element
            dataContainer.innerHTML = `
                <h2>${title}</h2>
                <p><strong>Author(s):</strong> ${authors}</p>
                <img src="${imageUrl}" alt="${title}" style="max-width: 100px; max-height: 100px;">
            `;
        }
    });
});
