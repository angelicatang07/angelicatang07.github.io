// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, push, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

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
const database = getDatabase(app);

// Reference to task collections
const unfinishedTaskRef = ref(database, 'unfinished_task');
const finishedTaskRef = ref(database, 'finished_task');

// Submit button click event listener
const submitButton = document.getElementById("input_button");
submitButton.addEventListener("click", () => {
    const inputBox = document.getElementById("input_box");
    const inputDate = document.getElementById("input_date");
    
    const title = inputBox.value.trim();
    const date = inputDate.value;

    if (title.length === 0 || date.length === 0) {
        alert("Please enter both task title and date.");
        return;
    }

    // Add task to database
    const newTaskRef = push(unfinishedTaskRef);
    update(newTaskRef, {
        title: title,
        date: date
    }).then(() => {
        inputBox.value = "";
        inputDate.value = "";
        create_unfinished_task(); // Refresh task list
    }).catch(error => {
        console.error("Error adding task: ", error);
    });
});

// Function to create unfinished tasks
function create_unfinished_task() {
    const unfinishedTaskContainer = document.getElementById("unfinished_tasks_container");
    unfinishedTaskContainer.innerHTML = ""; // Clear existing tasks

    onValue(unfinishedTaskRef, (snapshot) => {
        const tasks = snapshot.val();
        for (let key in tasks) {
            if (tasks.hasOwnProperty(key)) {
                const task = tasks[key];
                const taskContainer = createTaskElement(task, key, 'unfinished');
                unfinishedTaskContainer.appendChild(taskContainer);
            }
        }
    });
}

// Function to create finished tasks
function create_finished_task() {
    const finishedTaskContainer = document.getElementById("finished_tasks_container");
    finishedTaskContainer.innerHTML = ""; // Clear existing tasks

    onValue(finishedTaskRef, (snapshot) => {
        const tasks = snapshot.val();
        for (let key in tasks) {
            if (tasks.hasOwnProperty(key)) {
                const task = tasks[key];
                const taskContainer = createTaskElement(task, key, 'finished');
                finishedTaskContainer.appendChild(taskContainer);
            }
        }
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

    const date = document.createElement('p');
    date.setAttribute('class', 'task_date');
    date.textContent = task.date;

    // Task tools
    const taskTool = document.createElement('div');
    taskTool.setAttribute('class', 'task_tool');

    const taskDoneButton = document.createElement('button');
    taskDoneButton.setAttribute('class', 'task_done_button');
    taskDoneButton.innerHTML = '<i class="fa fa-check"></i>';
    taskDoneButton.addEventListener('click', () => {
        if (type === 'unfinished') {
            task_done(taskContainer);
        } else {
            task_finished_delete(taskContainer);
        }
    });

    const taskEditButton = document.createElement('button');
    taskEditButton.setAttribute('class', 'task_edit_button');
    taskEditButton.innerHTML = '<i class="fa fa-pencil"></i>';
    taskEditButton.addEventListener('click', () => {
        task_edit(taskContainer);
    });

    const taskDeleteButton = document.createElement('button');
    taskDeleteButton.setAttribute('class', 'task_delete_button');
    taskDeleteButton.innerHTML = '<i class="fa fa-trash"></i>';
    taskDeleteButton.addEventListener('click', () => {
        if (type === 'unfinished') {
            task_delete(taskContainer);
        } else {
            task_finished_delete(taskContainer);
        }
    });

    // Append elements
    taskTool.appendChild(taskDoneButton);
    taskTool.appendChild(taskEditButton);
    taskTool.appendChild(taskDeleteButton);
    taskData.appendChild(title);
    taskData.appendChild(date);
    taskContainer.appendChild(taskData);
    taskContainer.appendChild(taskTool);

    return taskContainer;
}

// Function to mark task as finished
function task_done(taskContainer) {
    const key = taskContainer.getAttribute("data-key");
    const taskRef = ref(database, 'unfinished_task/' + key);
    
    // Get task data
    onValue(taskRef, (snapshot) => {
        const taskData = snapshot.val();
        
        // Add task to finished tasks
        const newFinishedTaskRef = push(finishedTaskRef);
        update(newFinishedTaskRef, taskData);

        // Remove task from unfinished tasks
        remove(taskRef);

        // Refresh task lists
        create_unfinished_task();
        create_finished_task();
    });
}

// Function to edit task (contenteditable)
function task_edit(taskContainer) {
    // Toggle contenteditable and styles
    const titleElement = taskContainer.querySelector('.task_title');
    const dateElement = taskContainer.querySelector('.task_date');

    titleElement.contentEditable = true;
    dateElement.contentEditable = true;
    titleElement.classList.add('editing');
    dateElement.classList.add('editing');

    // Save changes on blur
    titleElement.addEventListener('blur', () => {
        save_edit(taskContainer);
    });
    dateElement.addEventListener('blur', () => {
        save_edit(taskContainer);
    });
}

// Function to save edited task
function save_edit(taskContainer) {
    const key = taskContainer.getAttribute("data-key");
    const taskRef = ref(database, 'unfinished_task/' + key);
    const title = taskContainer.querySelector('.task_title').textContent;
    const date = taskContainer.querySelector('.task_date').textContent;

    update(taskRef, {
        title: title,
        date: date
    }).then(() => {
        // Toggle contenteditable and styles
        const titleElement = taskContainer.querySelector('.task_title');
        const dateElement = taskContainer.querySelector('.task_date');
        titleElement.contentEditable = false;
        dateElement.contentEditable = false;
        titleElement.classList.remove('editing');
        dateElement.classList.remove('editing');
    }).catch(error => {
        console.error("Error updating task: ", error);
    });
}

// Function to delete task
function task_delete(taskContainer) {
    const key = taskContainer.getAttribute("data-key");
    const taskRef = ref(database, 'unfinished_task/' + key);

    // Remove task from database
    remove(taskRef).then(() => {
        // Remove task from UI
        taskContainer.remove();
    }).catch(error => {
        console.error("Error removing task: ", error);
    });
}

// Function to delete finished task
function task_finished_delete(taskContainer) {
    const key = taskContainer.getAttribute("data-key");
    const taskRef = ref(database, 'finished_task/' + key);

    // Remove task from database
    remove(taskRef).then(() => {
        // Remove task from UI
        taskContainer.remove();
    }).catch(error => {
        console.error("Error removing finished task: ", error);
    });
}
