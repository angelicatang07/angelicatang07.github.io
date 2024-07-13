import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, push, update } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const btn = document.getElementById('input_button');
btn.addEventListener('click', add_task);

function add_task() {
  const input_box = document.getElementById('input_box');
  const input_date = document.getElementById('input_date');

  if (input_box.value.trim() !== "") {
    const key = push(ref(database, "unfinished_task")).key;
    console.log("Generated key:", key);
    
    const task = {
      task: input_box.value,
      date: input_date.value,
      key: key,
    };
    console.log("Task object:", task);
    
    const updates = {};
    updates['/unfinished_task/' + key] = task;
    console.log("Updates object:", updates);
    
    update(ref(database), updates).then(() => {
      console.log("Task added successfully!");
      input_box.value = "";
      input_date.value = "";
    }).catch((error) => {
      console.error("Error adding task:", error);
      window.alert("Error adding task: " + error.message);
    });
  } else {
    window.alert("Please enter a task");
  }
}
