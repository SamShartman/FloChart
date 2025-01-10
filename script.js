// DOM Elements
const board = document.getElementById('board');
const addListBtn = document.getElementById('add-list');
let draggedCard = null; // For dragging cards
let draggedList = null; // For dragging lists
let selectedList = null; // To store the currently selected list
let selectedCard = null; // To store the currently selected card
let isEditingCard = false; // Flag to track card editing state
let isTyping = false; // Flag to track if typing is happening
let deleteConfirmationPopup = null; // Store the delete confirmation popup

// Function to create a new list
function createList(title = 'Enter List Name') {
  const list = document.createElement('div');
  list.className = 'list';
  list.setAttribute('draggable', 'true');
  list.innerHTML = `
    <h3 class="list-title" contenteditable="true">${title}</h3>
    <button class="add-card">+ Add Card</button>
    <div class="cards" ondrop="drop(event)" ondragover="allowDrop(event)">
      <!-- Cards will be added here -->
    </div>
  `;

  // Event listener to highlight the list when clicked
  list.addEventListener('click', (e) => {
    e.stopPropagation();
    if (selectedList) {
      selectedList.classList.remove('highlighted');
    }
    selectedList = list;
    selectedList.classList.add('highlighted');
  });

  // Enable list dragging
  list.addEventListener('dragstart', (e) => {
    draggedList = list;
    list.style.opacity = '0.5';
  });

  list.addEventListener('dragend', () => {
    draggedList = null;
    list.style.opacity = '1';
  });

  // Add event listener to add a new card
  const addCardButton = list.querySelector('.add-card');
  addCardButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = createCard('New Card');
    list.querySelector('.cards').appendChild(card);
  });

  board.appendChild(list);
}

// Function to create a new card
function createCard(text = 'New Card') {
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('draggable', 'true');
  card.innerHTML = `
    <p class="card-text">${text}</p>
    <div class="due-date">
      Due Date: <span contenteditable="true">Set Date</span>
    </div>
  `;

  // Enable card dragging
  card.addEventListener('dragstart', (e) => {
    e.target.classList.add('dragging');
    draggedCard = e.target;
  });

  card.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
    draggedCard = null;
  });

  // Add double-click event to edit card text
  card.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    if (!isEditingCard) {
      editCardText(card);
    }
  });

  return card;
}

// Function to handle editing of card text
function editCardText(card) {
  const originalText = card.querySelector('.card-text').innerText;
  const editableDiv = document.createElement('div');
  editableDiv.contentEditable = 'true';
  editableDiv.innerText = originalText;
  card.innerHTML = '';
  card.appendChild(editableDiv);

  editableDiv.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      card.innerHTML = `<p class="card-text">${editableDiv.innerText}</p>`;
      isEditingCard = false;
    }
  });

  editableDiv.addEventListener('blur', () => {
    card.innerHTML = `<p class="card-text">${editableDiv.innerText}</p>`;
    isEditingCard = false;
  });

  isEditingCard = true;
  selectedCard = card;
}

// Allow card or list to be dropped
function allowDrop(e) {
  e.preventDefault();
}

// Handle dropping a card or list
function drop(e) {
  e.preventDefault();
  const target = e.target.closest('.cards');
  if (target && draggedCard) {
    target.appendChild(draggedCard);
  } else if (draggedList) {
    const board = document.getElementById('board');
    const afterElement = getDragAfterElement(board, e.clientX);
    if (afterElement) {
      board.insertBefore(draggedList, afterElement);
    } else {
      board.appendChild(draggedList);
    }
  }
}

// Helper function to find the element after the drag
function getDragAfterElement(container, x) {
  const draggableElements = [...container.querySelectorAll('.list:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = x - box.left - box.width / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Show delete confirmation dialog
function showDeleteConfirmation() {
  if (deleteConfirmationPopup) {
    return;
  }

  deleteConfirmationPopup = document.createElement('div');
  deleteConfirmationPopup.className = 'delete-confirmation';
  deleteConfirmationPopup.innerHTML = `
    <p>Are you sure you want to delete this list?</p>
    <button class="delete-button" id="no-button">Go Back</button>
    <button class="delete-button" id="yes-button">Delete</button>
  `;

  document.body.appendChild(deleteConfirmationPopup);

  const yesButton = deleteConfirmationPopup.querySelector('#yes-button');
  const noButton = deleteConfirmationPopup.querySelector('#no-button');

  yesButton.addEventListener('click', () => {
    selectedList.remove();
    closeDeleteConfirmation();
  });

  noButton.addEventListener('click', () => {
    closeDeleteConfirmation();
  });
}

// Close the delete confirmation dialog
function closeDeleteConfirmation() {
  if (deleteConfirmationPopup) {
    deleteConfirmationPopup.remove();
    deleteConfirmationPopup = null;
  }
}

// Add new list when button is clicked
addListBtn.addEventListener('click', () => {
  createList();
});

// Initialize with one list
createList();

// Deselect lists/cards when clicking anywhere on the background
document.body.addEventListener('click', (e) => {
  if (!e.target.closest('.list') && !e.target.closest('.card')) {
    if (selectedList) {
      selectedList.classList.remove('highlighted');
      selectedList = null;
    }
    if (selectedCard) {
      selectedCard.classList.remove('highlighted');
      selectedCard = null;
    }
  }
});
