import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, update, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
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

// Function to handle profile picture submission
const submitpfp = document.getElementById("submitpfp");
submitpfp.addEventListener('click', () => {
    const pfp = document.getElementById("fileToUpload").files[0]; // Get the file object

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();

                    const storageRef = storage.ref('profile_picture/' + user.uid + '/' + pfp.name);
                    storageRef.put(pfp).then(() => {
                        storageRef.getDownloadURL().then((url) => {
                            const user_data = {
                                profile_picture: url
                            };
                            update(userRef, user_data).then(() => {
                                alert('Profile picture updated successfully!');
                                checkUserLoggedIn();
                            }).catch((error) => {
                                console.error("Error updating user data:", error);
                            });
                        }).catch((error) => {
                            console.error("Error getting download URL:", error);
                        });
                    }).catch((error) => {
                        console.error("Error uploading profile picture:", error);
                    });

                } else {
                    console.log("No user data found");
                }
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
        } else {
            alert("Please log in to update your profile picture.");
        }
    });
});

// Function to check user login status and update profile picture display
function checkUserLoggedIn() {
    const loginbtn = document.querySelector(".login-btn");
    const profDiv = document.getElementById("profile-pic");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const prof = userData.profile_picture || 'images/pfp.png'; // Default profile picture path
                    profDiv.src = prof; // Update the src attribute of the image tag
                    profDiv.style.display = "block";
                    loginbtn.style.display = "none"; // Hide login button if user is logged in
                } else {
                    console.log("No user data found");
                }
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
        } else {
            profDiv.style.display = "none";
            loginbtn.style.display = "block"; // Show login button if user is not logged in
        }
    });
}

// Initial call to check user login status
checkUserLoggedIn();
