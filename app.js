import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, push, update } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
// https://firebase.google.com/docs/web/setup#available-libraries

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

function add_task() {
var input_box = document.getElementById('input_box');
var input_date = document.getElementById('input_date');

if(input_box.value.trim() !== "") {
  var key = push(ref(database, "unfinished_task")).key;
  
  var task = {
    task: input_box.value,
    date: input_date.value,
    key: key,
  };
  
  var updates = {};
  updates['/unfinished_task/' + key] = task;
  
  update(ref(database), updates).then(() => {
    console.log("Task added successfully!");
    input_box.value = "";
    input_date.value = "";
  });
}

}

// }

// function task_done() {
//   alert("done");
// };

// function task_edit() {

// }

// function task_delete() {
//   window.alert("task delete");
// }

btn.addEventListener('click', add_task());