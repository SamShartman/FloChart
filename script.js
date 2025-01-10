// DOM Elements
const board = document.getElementById('board');
const addListBtn = document.getElementById('add-list');

// Drag-and-Drop Variables
let draggedItem = null;
let draggedList = null;

// Create a new list
function createList(title = 'Enter List Name') {
  const list = document.createElement('div');
  list.className = 'list';
  list.draggable = true;
  list.innerHTML = `
    <input class="list-title" value="${title}">
    <button class="add-card">+ Add Card</button>
    <div class="cards"></div>
    <button class="delete-btn">🗑</button>
  `;

  list.addEventListener('dragstart', () => (draggedList = list));
  list.addEventListener('dragover', (e) => e.preventDefault());
  list.addEventListener('drop', () => {
    if (draggedList) board.insertBefore(draggedList, list.nextSibling);
  });

  const addCardBtn = list.querySelector('.add-card');
  addCardBtn.addEventListener('click', () => createCard(list.querySelector('.cards')));

  const deleteBtn = list.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => list.remove());

  board.appendChild(list);
}

// Create a new card
function createCard(container) {
  const card = document.createElement('div');
  card.className = 'card';
  card.draggable = true;
  card.innerHTML = `
    <input class="card-text" value="New Card">
    <button class="add-due-date">+ Add Due Date</button>
    <div class="due-date"></div>
    <button class="delete-btn">🗑</button>
  `;

  card.addEventListener('dragstart', () => (draggedItem = card));
  card.addEventListener('dragover', (e) => e.preventDefault());
  card.addEventListener('drop', () => {
    if (draggedItem && draggedItem !== card) container.appendChild(draggedItem);
  });

  const dueDateBtn = card.querySelector('.add-due-date');
  dueDateBtn.addEventListener('click', () => {
    const dateInput = prompt('Enter Due Date (YYYY-MM-DD):');
    if (dateInput) {
      card.querySelector('.due-date').innerText = `Due: ${dateInput}`;
    }
  });

  const deleteBtn = card.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => card.remove());

  container.appendChild(card);
}

// Add initial list
addListBtn.addEventListener('click', () => createList());
createList();
// Create a new card
function createCard(container) {
  const card = document.createElement('div');
  card.className = 'card';
  card.draggable = true;
  card.innerHTML = `
    <input class="card-text" value="New Card">
    <button class="add-due-date">+ Add Due Date</button>
    <div class="due-date-container">
      <input type="date" class="due-date" style="display: none;">
      <span class="due-date-display"></span>
    </div>
    <button class="delete-btn">🗑</button>
  `;

  card.addEventListener('dragstart', () => (draggedItem = card));
  card.addEventListener('dragover', (e) => e.preventDefault());
  card.addEventListener('drop', () => {
    if (draggedItem && draggedItem !== card) container.appendChild(draggedItem);
  });

  // Due date functionality
  const dueDateBtn = card.querySelector('.add-due-date');
  const dueDateInput = card.querySelector('.due-date');
  const dueDateDisplay = card.querySelector('.due-date-display');

  dueDateBtn.addEventListener('click', () => {
    dueDateInput.style.display = 'inline-block';
    dueDateInput.focus();
  });

  dueDateInput.addEventListener('change', () => {
    if (dueDateInput.value) {
      dueDateDisplay.textContent = `Due: ${dueDateInput.value}`;
      dueDateInput.style.display = 'none';
      dueDateBtn.style.display = 'none';
    }
  });

  // Delete button functionality
  const deleteBtn = card.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => card.remove());

  container.appendChild(card);
}

