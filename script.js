// DOM Elements
const board = document.getElementById('board');
const addListBtn = document.getElementById('add-list');
let draggedCard = null; // For dragging cards
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
    e.stopPropagation(); // Prevent click from propagating to the background
    if (selectedList) {
      selectedList.classList.remove('highlighted');
    }
    selectedList = list;
    selectedList.classList.add('highlighted');
  });

  // Add event listener to add a new card
  const addCardButton = list.querySelector('.add-card');
  addCardButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent click from propagating to the background
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('draggable', 'true');
    card.innerText = 'New Card';
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
      e.stopPropagation(); // Prevent click from propagating to the background
      if (!isEditingCard) {
        editCardText(card);
      }
    });

    list.querySelector('.cards').appendChild(card);
  });

  board.appendChild(list);
}

// Function to handle editing of card text
function editCardText(card) {
  const originalText = card.innerText;
  const editableDiv = document.createElement('div');
  editableDiv.contentEditable = 'true';
  editableDiv.innerText = originalText;
  card.innerHTML = '';
  card.appendChild(editableDiv);

  // When user presses Enter, save the changes
  editableDiv.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      card.innerText = editableDiv.innerText; // Save changes
      isEditingCard = false; // Disable editing mode
    }
  });

  // When user clicks outside, save the changes
  editableDiv.addEventListener('blur', () => {
    card.innerText = editableDiv.innerText; // Save changes
    isEditingCard = false; // Disable editing mode
  });

  isEditingCard = true; // Enable editing mode
  selectedCard = card; // Track the card being edited
}

// Allow card to be dropped
function allowDrop(e) {
  e.preventDefault();
  const list = e.target.closest('.list');
  if (list) {
    // Add translucent effect to the dragged card
    draggedCard.style.opacity = '0.5';
    // Highlight the drop area with a lighter color
    const dropArea = list.querySelector('.cards');
    dropArea.classList.add('highlight-drop-area');
  }
}

// Handle dropping a card into a new list
function drop(e) {
  e.preventDefault();
  const target = e.target.closest('.cards');
  if (target && draggedCard) {
    // Drop the card into the list
    target.appendChild(draggedCard);
    draggedCard.style.opacity = '1'; // Restore the original opacity
  }
  // Remove the drop highlight
  const dropArea = e.target.closest('.cards');
  if (dropArea) {
    dropArea.classList.remove('highlight-drop-area');
  }
}

// Detect pressing Backspace and show delete confirmation dialog
document.addEventListener('keydown', (e) => {
  // Check if a card is being edited or a contenteditable field is focused
  if (document.activeElement && document.activeElement.isContentEditable) {
    isTyping = true; // User is typing, prevent deletion
  } else {
    isTyping = false; // No typing happening
  }

  if (!isTyping) {
    if (e.key === 'Backspace' && selectedList && !isEditingCard) {
      showDeleteConfirmation();
    }

    if (e.key === 'Enter' && selectedList && !isEditingCard) {
      // Prevent Enter from triggering list deletion while typing
      if (!document.activeElement.isContentEditable) {
        showDeleteConfirmation();
      }
    }
  }
});

// Show delete confirmation dialog
function showDeleteConfirmation() {
  if (deleteConfirmationPopup) {
    return; // Prevent showing the popup if it's already visible
  }

  deleteConfirmationPopup = document.createElement('div');
  deleteConfirmationPopup.className = 'delete-confirmation';
  deleteConfirmationPopup.innerHTML = `
    <p>Are you sure you want to delete this list?</p>
    <button class="delete-button" id="no-button">Go Back</button>
    <button class="delete-button" id="yes-button">Delete</button>
  `;

  // Append to body and show the confirmation
  document.body.appendChild(deleteConfirmationPopup);

  // Get buttons
  const yesButton = deleteConfirmationPopup.querySelector('#yes-button');
  const noButton = deleteConfirmationPopup.querySelector('#no-button');

  // Handle "Delete" button (Delete the list and close the confirmation)
  yesButton.addEventListener('click', () => {
    selectedList.remove();
    closeDeleteConfirmation();
  });

  // Handle "Go Back" button (Do nothing, close the confirmation)
  noButton.addEventListener('click', () => {
    closeDeleteConfirmation();
  });

  // Add keydown event listener to trigger 'Delete' on Enter key
  document.addEventListener('keydown', function handleEnterKey(event) {
    if (event.key === 'Enter') {
      yesButton.click(); // Trigger the "Delete" button click
      document.removeEventListener('keydown', handleEnterKey); // Remove the event listener once Enter is pressed
    }
  });
}

// Close the delete confirmation dialog
function closeDeleteConfirmation() {
  if (deleteConfirmationPopup) {
    deleteConfirmationPopup.remove();
    deleteConfirmationPopup = null; // Clear the reference
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
    // Deselect list
    if (selectedList) {
      selectedList.classList.remove('highlighted');
      selectedList = null;
    }

    // Deselect card
    if (selectedCard) {
      selectedCard.classList.remove('highlighted');
      selectedCard = null;
    }

    // If a card is being edited, save it when deselecting
    if (isEditingCard && selectedCard) {
      const cardText = selectedCard.querySelector('[contenteditable="true"]').innerText;
      selectedCard.innerText = cardText;
      isEditingCard = false;
    }
  }
});

