import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, update, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js"; // Import Firebase Storage components

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
const storage = getStorage(app);



const discordForm = document.getElementById("discord");
const instagramForm = document.getElementById("instagram");
const linkedinForm = document.getElementById("linkedin");

const DTag= document.getElementById('d-tag');
const ITag= document.getElementById('i-tag');
const instaTag = document.getElementById("insta-tag");
const LTag= document.getElementById('l-tag');
const linkedinTag = document.getElementById("linkedin-tag");

function checkUserLoggedIn() {
    const loginbtn = document.querySelector(".login-btn");
    const profDiv = document.getElementById("profile-pic");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const username = userData.name;
                    const mail = userData.email;
                    const gram = userData.instagram_handle;
                    const lnkin = userData.linkedin_acc;
                    const kord = userData.discord_user;
                    const prof = userData.profile_picture; // Default profile picture path
                    profDiv.src = prof; // Update the src attribute of the image tag
                    profDiv.style.display = "block";
                    loginbtn.style.display = "none"; // Hide login button if user is logged in
                    const dump = document.getElementById('data');
                    dump.innerHTML= `<p>${username} <br /> <p style="inline">(private) ${mail}</p> <br /> <img src="${prof}" /></p>`;
                    DTag.innerHTML =  `${kord}`;
                    ITag.innerHTML=  `@${gram}`;
                    LTag.innerHTML= `${lnkin}`;
                          instaTag.href = `https://www.instagram.com/${gram}?igsh=MTFsdDZoaGpxbjdleg%3D%3D&utm_source=qr`;
                          instaTag.target = "_blank";
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

discordForm.addEventListener("submit", (e) => {
    e.preventDefault();

        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = ref(database, 'users/' + user.uid);
                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        const dc = document.getElementById('dc');
                        const user_data = {
                           discord_user: dc.value
                          };
                          DTag.innerHTML=  `${dc.value}`;
                          update(userRef, user_data);
                    } else {
                        console.log("No user data found");
                    }
                }).catch((error) => {
                    console.error("Error fetching user data:", error);
                });
            } else {
                alert('error');
            }
        });
    }
);

instagramForm.addEventListener("submit", (e) => {
    e.preventDefault();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = ref(database, 'users/' + user.uid);
                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        const insta = document.getElementById('insta');
                        const user_data = {
                           instagram_handle: insta.value
                          };
                          update(userRef, user_data);
                          ITag.innerHTML=  `@${insta.value}`;
                          instaTag.href = `https://www.instagram.com/${insta.value}?igsh=MTFsdDZoaGpxbjdleg%3D%3D&utm_source=qr`;
                          instaTag.target = "_blank";
                    } else {
                        console.log("No user data found");
                    }
                }).catch((error) => {
                    console.error("Error fetching user data:", error);
                });
            } else {
                alert('error');
            }
        });
    }
);

linkedinForm.addEventListener("submit", (e) => {
    e.preventDefault();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = ref(database, 'users/' + user.uid);
                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        const linkedin = document.getElementById('linked');
                        const user_data = {
                           linkedin_acc: linkedin.value
                          };
                          update(userRef, user_data);
                          LTag.innerHTML=  `linkedin.com`;
                          linkedinTag.href = `${linkedin.value}`;
                          linkedinTag.target = "_blank";
                    } else {
                        console.log("No user data found");
                    }
                }).catch((error) => {
                    console.error("Error fetching user data:", error);
                });
            } else {
                alert('error');
            }
        });
    }
);
checkUserLoggedIn();
