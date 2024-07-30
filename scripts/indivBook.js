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

    const pic = document.getElementById("spotlight-img");

    const books = await fetchBookDetails('The secrets of wilderfort castle');
    const targetAuthor = "Jessica Jayne Webb";

    if (books && books.length > 0) {
        const book = books.find(book => {
            const authors = book.volumeInfo.authors || [];
            return authors.includes(targetAuthor);
        });

        if (book) {
            const volumeInfo = book.volumeInfo; 
            const imageUrl = volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : "../images/default-book-cover.jpg";
            pic.src = imageUrl;
        } else {
        }
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

document.addEventListener('DOMContentLoaded', function(e) {
    e.preventDefault();

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
        const s = document.getElementById('start-date').value.trim();
        const e = document.getElementById('end-date').value.trim();
        const start = formatDate(new Date(s));
        const end = formatDate(new Date(e));

        if (title.length === 0 || rev.length === 0 || rating === 0 || !start || !end ) {
            alert("Please fill in all fields and rate the book.");
            return;
        }
        const unfinishedTaskRef = ref(database, 'regular_reviews'); // Define Firebase reference
        const newTaskRef = push(unfinishedTaskRef);
    
        update(newTaskRef, {
            title: title,
            creator: username,
            email: email,
            review: rev,
            stars: rating,
            date: date,
            start: start,
            end: end
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

async function spotlight() {
    const pic = document.getElementById("spotlight-img");

    const books = await fetchBookDetails('The secrets of wilderfort castle');
    const targetAuthor = "Jessica Jayne Webb";

    if (books && books.length > 0) {
        const book = books.find(book => {
            const authors = book.volumeInfo.authors || [];
            return authors.includes(targetAuthor);
        });

        if (book) {
            const volumeInfo = book.volumeInfo; 
            const imageUrl = volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : "images/default-book-cover.jpg";
            pic.src = imageUrl;
        } else {
        }
    }

}

document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();
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


spotlight();


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