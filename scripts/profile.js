import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, update, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth,signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";
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
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Reference DOM elements
const discordForm = document.getElementById("discord");
const instagramForm = document.getElementById("instagram");
const linkedinForm = document.getElementById("linkedin");
const aboutForm = document.getElementById("aboutme");
const ATag = document.getElementById('a-tag');
const DTag = document.getElementById('d-tag');
const ITag = document.getElementById('i-tag');
const LTag = document.getElementById('l-tag');
let username = document.getElementById('username');
let profile = document.getElementById("profile-pic");
let profile2 = document.getElementById("profile-pic2");
let emailinfo = document.getElementById("email");
// Function to update user profile based on form submission
function updateUserProfile(userRef, formData) {
    update(userRef, formData)
        .then(() => {
            console.log('User profile updated successfully');
            
        })
        .catch((error) => {
            console.error('Error updating user profile:', error);
            console.log('Failed to update profile. Please try again.');
        });
}

// Function to fetch and display user profile data
function fetchUserProfile() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            get(userRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        const { name, email, instagram_handle, linkedin_acc, discord_user, profile_picture,about_me } = userData;

                        emailinfo.innerHTML=`<p class="private"><strong>Private*  </strong>  ${DOMPurify.sanitize(email)}</p>`;
                        profile.src = `${DOMPurify.sanitize(profile_picture)}`;
                        profile2.src = `${DOMPurify.sanitize(profile_picture)}`;
                        username.innerHTML =  `${DOMPurify.sanitize(name)}`;
                        DTag.innerHTML =  `${DOMPurify.sanitize(discord_user)}`;
                        ITag.innerHTML =  `${DOMPurify.sanitize(instagram_handle)}`;
                        LTag.innerHTML = `${DOMPurify.sanitize(linkedin_acc)}`;
                        ATag.innerHTML = `${DOMPurify.sanitize(about_me)}`;

                    } else {
                        console.log("No user data found");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        }
        else {
            window.location.href="../index.html";
        }
    });
}

discordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const dc = document.getElementById('dc').value.trim();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = ref(database, 'users/' + user.uid);
                const user_data = { discord_user: dc };
                updateUserProfile(userRef, user_data);
                DTag.innerHTML =  `${DOMPurify.sanitize(dc)}`;
            } else {
                console.error("User not authenticated");
                alert('User not authenticated. Please log in.');
            }
        });
});

instagramForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const insta = document.getElementById('insta').value.trim();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = ref(database, 'users/' + user.uid);
                const user_data = { instagram_handle: insta };
                updateUserProfile(userRef, user_data);
                ITag.innerHTML =  `${DOMPurify.sanitize(insta)}`;
                } else {
                console.error("User not authenticated");
                alert('User not authenticated. Please log in.');
            }
        });
});

linkedinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const linkedin = document.getElementById('linked').value.trim();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = ref(database, 'users/' + user.uid);
                const user_data = { linkedin_acc: linkedin };
                updateUserProfile(userRef, user_data);
                LTag.innerHTML =  `${DOMPurify.sanitize(linkedin)}`;
              } else {
                console.error("User not authenticated");
                alert('User not authenticated. Please log in.');
            }
        });
});

aboutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const about = document.getElementById('about').value.trim();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = ref(database, 'users/' + user.uid);
                const user_data = { about_me: about };
                updateUserProfile(userRef, user_data);
                ATag.innerHTML =  `${DOMPurify.sanitize(about)}`;
            } else {
                console.error("User not authenticated");
                alert('User not authenticated. Please log in.');
            }
        });
});

fetchUserProfile();

const sign_out = document.getElementById('sign-out');
sign_out.addEventListener('click', () => {
  
    signOut(auth).then(() => {
        alert("logging out");
        window.location.href = "../index.html";

    }).catch((error) => {
       console.log('error');
    });
    
})