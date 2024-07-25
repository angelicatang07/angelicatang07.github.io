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
let discord = 'unavailable';
let insta = 'unavailable';
let linkedin = 'unavailable';
let about = 'unavailable';
let prof = 'images/pfp.png';

// Check if the user is logged in and update profile and wishlist
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
                    discord = userData.discord_user || "unavailable";
                    insta = userData.instagram_handle || "unavailable";
                    linkedin = userData.linkedin_acc || "unavailable";
                    about = userData.about_me || "unavailable";
                    prof = userData.profile_picture || '../images/pfp.png';

                    // Update HTML elements with user data
                    document.getElementById("username").textContent = username;
                    document.getElementById("i-tag").textContent = insta;
                    document.getElementById("l-tag").textContent = linkedin;
                    document.getElementById("d-tag").textContent = discord;
                    document.getElementById("a-tag").textContent = about;
                    profDiv.src = prof;
                    profDiv.style.display = "block";
                } else {
                    console.log("No user data found");
                }
                loginbtn.style.display = "none"; // Hide login button if user is logged in
                create_wishlist(); // Load wishlist after login
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
    const submitButton = document.getElementById("input_button");

    submitButton.addEventListener("click", () => {
        const inputBox = document.getElementById("input_box");
        const title = inputBox.value.trim();

        if (title.length === 0) {
            alert("Please enter a book title.");
            return;
        }

        const user = auth.currentUser;
        if (user) {
            const wishlistRef = ref(database, 'users/' + user.uid + '/wishlist'); // Reference to user's wishlist
            const newBookRef = push(wishlistRef);

            update(newBookRef, {
                title: title
            }).then(() => {
                inputBox.value = "";
                document.getElementById("data").innerHTML= "";
                create_wishlist(); // Refresh wishlist
            }).catch(error => {
                console.error("Error adding book to wishlist: ", error);
            });
        } else {
            alert("Please log in to add books to your wishlist.");
        }
    });

    checkUserLoggedIn();
});

function create_wishlist() {
    const wishlistContainer = document.getElementById("book_container");
    const user = auth.currentUser;

    if (user) {
        const wishlistRef = ref(database, 'users/' + user.uid + '/wishlist');

        onValue(wishlistRef, (snapshot) => {
            const books = snapshot.val();
            if (books) {
                wishlistContainer.innerHTML = "";

                Object.keys(books).forEach(key => {
                    const book = books[key];
                    const bookContainer = createBookElement(book, key);
                    wishlistContainer.prepend(bookContainer);
                });
            } else {
                wishlistContainer.innerHTML = "<p>Your favorites list is empty.</p>";
            }
        });
    } else {
        wishlistContainer.innerHTML = "<p>Please log in to see your wishlist.</p>";
    }
}

function createBookElement(book, key) {
    const bookContainer = document.createElement("div");
    bookContainer.setAttribute("class", "book_container");
    bookContainer.setAttribute("data-key", key);

    const bookTool = document.createElement('div');
    bookTool.setAttribute('class', 'book_tool');

    const bookDeleteButton = document.createElement('button');
    bookDeleteButton.setAttribute('class', 'book_delete_button');
    bookDeleteButton.innerHTML = '<i class="bx bx-trash" style="cursor:pointer"></i>';
    bookDeleteButton.classList.add('cursor-pointer');
    bookDeleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        book_delete(key); // Pass the key to the delete function
    });

    // Fetch book details and update book container
    fetchBookDetails(book.title)
        .then((books) => {
            if (books && books.length > 0) {
                const bookData = books[0].volumeInfo;
                const authors = bookData.authors ? bookData.authors.join(", ") : "Unknown author";
                const imageUrl = bookData.imageLinks ? bookData.imageLinks.thumbnail : "images/default-book-cover.jpg";

                const bookCover = document.createElement('img');
                bookCover.setAttribute('class', 'book_cover');
                bookCover.setAttribute('src', imageUrl);
                bookCover.setAttribute('alt', book.title);

                bookContainer.prepend(bookCover);
            }
        })
        .catch((error) => {
            console.error("Error fetching book details:", error);
        });

    bookTool.prepend(bookDeleteButton);
    bookContainer.prepend(bookTool);

    return bookContainer;
}

function book_delete(key) {
    const user = auth.currentUser;

    if (user) {
        const bookRef = ref(database, 'users/' + user.uid + '/wishlist/' + key); // Reference to specific book

        remove(bookRef).then(() => {
            console.log("Book removed from wishlist successfully");
            // Remove book from UI
            const bookElement = document.querySelector(`.book_container[data-key="${key}"]`);
            if (bookElement) {
                bookElement.remove();
            }
        }).catch(error => {
            console.error("Error removing book from wishlist: ", error);
        });
    } else {
        alert("Please log in to remove books from your wishlist.");
    }
}


async function fetchBookDetails(title) {
    const apiKey = "AIzaSyA98Jj3WzrB4I3sxTUcxEE5jvHeMGh7RJA"; 
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
