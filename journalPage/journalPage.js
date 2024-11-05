const journalForm = document.getElementById('journal-form');
const journalEntries = document.getElementById('journal-entries');
const deleteConfirm = document.getElementById('delete-confirm');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const fullEntrySection = document.getElementById('full-entry');
const fullEntryTitle = document.getElementById('full-entry-title');
const fullEntryContent = document.getElementById('full-entry-content');
const fullEntryDate = document.getElementById('full-entry-date');
const backButton = document.getElementById('back-button');
const logoutButton = document.getElementById('logout-button');
const loginContainer = document.getElementById('login-container');
const journalContainer = document.getElementById('journal-container');
const loginMessage = document.getElementById('login-message');

let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
let currentDeleteIndex = null;

// Ensure the login screen is shown first when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    showJournal();
  } else {
    showLogin();
  }
});

function showLogin() {
  loginContainer.style.display = 'block';
  journalContainer.style.display = 'none';
}

function showJournal() {
  loginContainer.style.display = 'none';
  journalContainer.style.display = 'block';
  displayEntries();
}

function login() {
  const username = document.getElementById("userName").value;
  const password = document.getElementById("userPassword").value;

  if (username.trim() === '' || password.trim() === '') {
    loginMessage.textContent = 'Please enter both username and password.';
    return;
  }

  localStorage.setItem('loggedInUser', username);
  document.getElementById("userName").value = ''; // Clear username field
  document.getElementById("userPassword").value = ''; // Clear password field
  showJournal();
}

function displayEntries() {
  journalEntries.innerHTML = '';
  entries.forEach((entry, index) => {
    const entryElement = document.createElement('div');
    entryElement.classList.add('entry');
    entryElement.innerHTML = `
      <h3>${entry.title}</h3>
      <button class="delete-btn">Delete</button>
    `;
    entryElement.addEventListener('click', () => showFullEntry(index));

    // Add event listener to delete button
    entryElement.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      showDeleteConfirmation(index);
    });

    journalEntries.appendChild(entryElement);
  });
}

function showNewEntryForm() {
  journalForm.style.display = 'flex';
  journalEntries.style.display = 'none';
  fullEntrySection.style.display = 'none';
}

function showFullEntry(index) {
  const entry = entries[index];
  fullEntryTitle.textContent = entry.title;
  fullEntryContent.textContent = entry.content;
  fullEntryDate.textContent = new Date(entry.date).toLocaleString();
  fullEntrySection.style.display = 'block';
  journalEntries.style.display = 'none';
  journalForm.style.display = 'none';
}

journalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const newEntry = {
    title,
    content,
    date: new Date().toISOString()
  };
  entries.unshift(newEntry);
  localStorage.setItem('journalEntries', JSON.stringify(entries));
  journalForm.reset();
  displayEntries();
  journalForm.style.display = 'none';
  journalEntries.style.display = 'grid';
});

function showDeleteConfirmation(index) {
  currentDeleteIndex = index;
  deleteConfirm.style.display = 'block';
}

function hideDeleteConfirmation() {
  deleteConfirm.style.display = 'none';
}

function deleteEntry() {
  if (currentDeleteIndex !== null) {
    entries.splice(currentDeleteIndex, 1);
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    displayEntries();
    hideDeleteConfirmation();
    currentDeleteIndex = null;
  }
}

confirmDeleteBtn.addEventListener('click', deleteEntry);
cancelDeleteBtn.addEventListener('click', hideDeleteConfirmation);

backButton.addEventListener('click', () => {
  fullEntrySection.style.display = 'none';
  journalEntries.style.display = 'grid';
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  document.getElementById("userName").value = ''; // Clear username field
  document.getElementById("userPassword").value = ''; // Clear password field
  showLogin();
});
