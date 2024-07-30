import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

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
const auth = getAuth(app);
const database = getDatabase(app);

function checkUserLoggedIn() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    username = userData.name;
                } else {
                    console.log("No user data found");
                }
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
        } else {
            window.location.href = "../index.html";
        }
    });
}

async function fetchReviewsByTitle(title) {
    const reviewsRef = ref(database, 'regular_reviews');
    return new Promise((resolve, reject) => {
        onValue(reviewsRef, (snapshot) => {
            const reviews = snapshot.val();
            console.log("All reviews from Firebase:", reviews); // Log all reviews

            if (reviews) {
                // Filter reviews based on the title
                const filteredReviews = Object.keys(reviews).filter(key => reviews[key].title === title)
                                                         .reduce((obj, key) => {
                                                            obj[key] = reviews[key];
                                                            return obj;
                                                         }, {});
                console.log("Filtered reviews:", filteredReviews); // Log filtered reviews
                resolve(filteredReviews);
            } else {
                console.log("No reviews found.");
                resolve({});
            }
        }, (error) => {
            console.error("Error fetching reviews:", error);
            reject(error);
        });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const reviewsContainer = document.getElementById('reviews-container');

        const bookTitle = 'The Secrets of Wilderfort Castle'; // Ensure this matches your database
        try {
            const reviews = await fetchReviewsByTitle(bookTitle);
            console.log("Reviews received:", reviews); // Log received reviews
            reviewsContainer.innerHTML = '';
            if (Object.keys(reviews).length > 0) {
                Object.values(reviews).forEach(review => {
                    reviewsContainer.innerHTML += `
                        <div class="review">
                            <p>${review.creator}  ${review.date}</p>
                            <p>${review.review}</p>
                        </div>
                    `;
                });
            } else {
                reviewsContainer.innerHTML = '<p>No reviews found for this title.</p>';
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            reviewsContainer.innerHTML = '<p>Error fetching reviews.</p>';
        }

    checkUserLoggedIn();
});


