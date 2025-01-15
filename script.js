const board = document.getElementById('board');
const addListBtn = document.getElementById('add-list');
const boardTitle = document.getElementById('board-title');

// Save and load board title
boardTitle.addEventListener('blur', () => {
  const titleText = boardTitle.innerText.trim();
  localStorage.setItem('boardTitle', titleText || 'My Kanban Board');
});
window.addEventListener('load', () => {
  const savedTitle = localStorage.getItem('boardTitle');
  boardTitle.innerText = savedTitle || 'My Kanban Board';
});

let draggedCard = null; // For tracking dragged cards

// Create a new list
function createList(title = 'Enter List Name') {
  const list = document.createElement('div');
  list.className = 'list';
  list.setAttribute('draggable', 'true');
  list.innerHTML = `
    <h3 class="list-title" contenteditable="true">${title}</h3>
    <button class="add-card">+ Add Card</button>
    <div class="cards" ondrop="event.preventDefault();" ondragover="event.preventDefault();"></div>
    <button class="delete-list">Delete List</button>
  `;

  // Add card functionality
  list.querySelector('.add-card').addEventListener('click', () => {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('draggable', 'true');
    card.innerHTML = `
      <span contenteditable="true">New Card</span>
      <input type="date" class="due-date" />
      <button class="delete-card">X</button>
    `;
    list.querySelector('.cards').appendChild(card);

    enableCardDragging(card);

    // Delete card functionality
    card.querySelector('.delete-card').addEventListener('click', () => {
      card.remove();
    });
  });

  // Delete list functionality
  list.querySelector('.delete-list').addEventListener('click', () => {
    list.remove();
  });

  board.appendChild(list);
}

// Enable card dragging functionality
function enableCardDragging(card) {
  card.addEventListener('dragstart', (e) => {
    draggedCard = card;
    card.classList.add('dragging');
  });
  card.addEventListener('dragend', () => {
    draggedCard = null;
    card.classList.remove('dragging');
  });
}

// Handle card drag-and-drop (cards between lists)
board.addEventListener('dragover', (e) => {
  e.preventDefault();
  const cardContainer = e.target.closest('.cards');
  if (cardContainer && draggedCard) {
    cardContainer.classList.add('dragover');
  }
});
board.addEventListener('dragleave', (e) => {
  const cardContainer = e.target.closest('.cards');
  if (cardContainer) {
    cardContainer.classList.remove('dragover');
  }
});
board.addEventListener('drop', (e) => {
  e.preventDefault();
  const cardContainer = e.target.closest('.cards');
  if (cardContainer && draggedCard) {
    cardContainer.appendChild(draggedCard);
    cardContainer.classList.remove('dragover');
  }
});

// Add a new list
addListBtn.addEventListener('click', () => createList());

// Initialize with one list
createList();
