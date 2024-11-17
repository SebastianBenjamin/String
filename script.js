const alphabets = 'abcdefghijklmnopqrstuvwxyz'.split('');
function generateRandomWord() {
    let word = '';
    const usedIndices = new Set();

    while (word.length < 7) {
        const randomIndex = Math.floor(Math.random() * alphabets.length);
        if (!usedIndices.has(randomIndex)) {
            word += alphabets[randomIndex];
            usedIndices.add(randomIndex);
        }
    }

    return word;
}

const passwordInput = document.getElementById('lf-psw');
const togglePassword = document.getElementById('togglePassword');

togglePassword.addEventListener('click', function () {
    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle the text of the toggle password button
    this.textContent = type === 'password' ? 'Show' : 'Hide';
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getDatabase, ref, set, update } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA_-SNMVZQVQM-eDK3aY_kGYg2hFigWTfo",
    authDomain: "web-test-1-d3b35.firebaseapp.com",
    databaseURL: "https://web-test-1-d3b35-default-rtdb.firebaseio.com",
    projectId: "web-test-1-d3b35",
    storageBucket: "web-test-1-d3b35.appspot.com",
    messagingSenderId: "1006418965402",
    appId: "1:1006418965402:web:2f8b1801b2cf7935c1c023",
    measurementId: "G-DD9YCHZ247"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const storage = getStorage(app);
document.getElementById('upload').addEventListener('click', uploadFile);

function uploadFile() {
    const fileInput = document.getElementById("file");
    const file = fileInput ? fileInput.files[0] : null;

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    const storageReference = storageRef(storage, 'uploads/String-' + file.name);
    const uploadTask = uploadBytesResumable(storageReference, file);

    uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
            console.error("Upload failed:", error);
            alert("Upload failed.");
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log("File available at:", downloadURL);
                saveFileDataToDatabase(file.name, downloadURL);
                alert('File uploaded successfully');
            });
        }
    );
}
// Function to save file data to Firebase RTDB
function saveFileDataToDatabase(fileName, fileURL) {
 document.getElementById('image').src=fileURL;
    set(ref(db, 'files/' + generateRandomWord()), {
        url: fileURL,
        name: fileName
    }).then(() => {
        console.log("File data saved to database.");
    }).catch((error) => {
        console.error("Failed to save file data:", error);
    });
}
