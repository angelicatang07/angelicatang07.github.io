// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, push, update, remove, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA8YaENTFjYlJ2KGfSKvUYeV0X0I63BRGs",
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

const ATag = document.getElementById('a-tag');
const DTag = document.getElementById('d-tag');
const ITag = document.getElementById('i-tag');
const LTag = document.getElementById('l-tag');
const username = document.getElementById('username');
const profile = document.getElementById("profile-pic");
const profile2 = document.getElementById("profile-pic2");
const emailinfo = document.getElementById("email");
const submitButton = document.getElementById("input_button");
const inputBox = document.getElementById("input_box");
const wishlistContainer = document.getElementById("book_container");
const dataContainer = document.getElementById("data");

function fetchUserProfile() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const { name, email, instagram_handle, linkedin_acc, discord_user, profile_picture, about_me } = userData;

                    emailinfo.innerHTML = `<p class="private"><strong>Private*  </strong>  ${DOMPurify.sanitize(email)}</p>`;
                    profile.src = `${DOMPurify.sanitize(profile_picture)}`;
                    profile2.src = `${DOMPurify.sanitize(profile_picture)}`;
                    username.innerHTML = `${DOMPurify.sanitize(name)}`;
                    DTag.innerHTML = `${DOMPurify.sanitize(discord_user)}`;
                    ITag.innerHTML = `${DOMPurify.sanitize(instagram_handle)}`;
                    LTag.innerHTML = `${DOMPurify.sanitize(linkedin_acc)}`;
                    ATag.innerHTML = `${DOMPurify.sanitize(about_me)}`;
                } else {
                    console.log("No user data found");
                }
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
        }
        else {
            window.location.href="../index.html";
        }
    });
}

function create_wishlist() {
    const user = auth.currentUser;

    if (user) {
        const wishlistRef = ref(database, 'users/' + user.uid + '/wishlist');

        onValue(wishlistRef, (snapshot) => {
            const books = snapshot.val();
            wishlistContainer.innerHTML = "";

            if (books) {
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
        wishlistContainer.innerHTML = "<p>Please log in to see your favorites.</p>";
    }
}

function createBookElement(book, key) {
    if (!book.title) {
        console.warn("Book title is undefined or empty:", book);
        return;
    }

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
        event.preventDefault();
        event.stopPropagation();
        book_delete(key);
    });

    fetchBookDetails(book.title).then((books) => {
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
    }).catch((error) => {
        console.error("Error fetching book details:", error);
    });

    bookTool.prepend(bookDeleteButton);
    bookContainer.prepend(bookTool);

    return bookContainer;
}

function book_delete(key) {
    const user = auth.currentUser;

    if (user) {
        const bookRef = ref(database, 'users/' + user.uid + '/wishlist/' + key);

        remove(bookRef).then(() => {
            console.log("Book removed from favorites successfully");
            const bookElement = document.querySelector(`.book_container[data-key="${key}"]`);
            if (bookElement) {
                bookElement.remove();
            }
        }).catch(error => {
            console.error("Error removing book from wishlist:", error);
        });
    } else {
        alert("Please log in to remove books from your favorites.");
    }
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
        console.log("API Response Data:", data);
        return data.items || [];
    } catch (error) {
        console.error("Error fetching book details:", error);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    submitButton.addEventListener("click", (e) => {
        e.preventDefault();

        const title = inputBox.value.trim();

        if (title.length === 0) {
            alert("Please enter a book title.");
            return;
        }

        const user = auth.currentUser;
        if (user) {
            const wishlistRef = ref(database, 'users/' + user.uid + '/wishlist');

            get(wishlistRef).then((snapshot) => {
                const existingBooks = snapshot.val() || {};
                const isDuplicate = Object.values(existingBooks).some(book => book.title === title);

                if (isDuplicate) {
                    alert("This book is already in your favorites.");
                    return;
                }

                const newBookRef = push(wishlistRef);

                update(newBookRef, { title: title }).then(() => {
                    inputBox.value = "";
                    dataContainer.innerHTML = "";
                    create_wishlist();
                }).catch(error => {
                    console.error("Error adding book to wishlist: ", error);
                });
            }).catch(error => {
                console.error("Error fetching wishlist:", error);
            });
        } else {
            alert("Please log in to add books to your favorites.");
        }
    });

    inputBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitButton.click();
        }
    });

    fetchUserProfile();
    create_wishlist();
});

inputBox.addEventListener("input", async (e) => {
    e.preventDefault();

    const bookTitle = inputBox.value.trim();

    const books = await fetchBookDetails(bookTitle);

    if (books && books.length > 0) {
        const book = books[0].volumeInfo;
        const title = book.title;
        const authors = book.authors ? book.authors.join(", ") : "Unknown author";
        const imageUrl = book.imageLinks ? book.imageLinks.thumbnail : "images/default-book-cover.jpg";

        dataContainer.innerHTML = `
            <h2>${title}</h2>
            <p><strong>Author(s):</strong> ${authors}</p>
            <img src="${imageUrl}" alt="${title}" style="max-width: 100px; max-height: 100px;">
        `;
    }
});

const sign_out = document.getElementById('sign-out');
sign_out.addEventListener('click', () => {
  
    signOut(auth).then(() => {
        alert("logging out");
        window.location.href = "../index.html";

    }).catch((error) => {
       console.log('error');
    });
    
})