// Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_FIREBASE_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DOM Elements
const board = document.getElementById('board');
const addListBtn = document.getElementById('add-list');

// Function to create a new list
function createList(title = 'New List') {
  const listId = Date.now();
  const list = document.createElement('div');
  list.className = 'list';
  list.innerHTML = `
    <h3 contenteditable="true">${title}</h3>
    <button class="add-card">+ Add Card</button>
    <div class="cards"></div>
  `;

  board.appendChild(list);

  // Add card functionality
  list.querySelector('.add-card').addEventListener('click', () => {
    const card = document.createElement('div');
    card.className = 'card';
    card.contentEditable = true;
    card.innerText = 'New Card';
    list.querySelector('.cards').appendChild(card);
  });
}

// Add new list
addListBtn.addEventListener('click', () => {
  createList();
});

// Initialize with one list
createList();
