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

let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
let currentDeleteIndex = null;

// Show journal on page load
document.addEventListener('DOMContentLoaded', () => {
  displayEntries(); 
});

function displayEntries() {
  journalEntries.innerHTML = '';
  entries.forEach((entry, index) => {
    const entryElement = document.createElement('div');
    entryElement.classList.add('entry');

    const imageSrc = entry.imagePath || getRandomImage();
    if (!entry.imagePath) {
      entry.imagePath = imageSrc;
      localStorage.setItem('journalEntries', JSON.stringify(entries));
    }
    entryElement.innerHTML = `
      <img src="${imageSrc}" alt="Bear" class="entry-image">
      <h3 class="entry-title">${entry.title}</h3>
      <small class="entry-date">${new Date(entry.date).toLocaleDateString()}</small>
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

function getRandomImage() {
  const images = ['src/bear/bear1.png','src/bear/bear2.png','src/bear/bear3.png','src/bear/bear4.png', 'src/bear/bear5.png'];
  return images[Math.floor(Math.random() * images.length)];
}

function showNewEntryForm() {
  journalForm.style.display = 'flex';
  journalEntries.style.display = 'none';
  fullEntrySection.style.display = 'none';
}

// Event listener for the Cancel button
document.getElementById('cancel-entry-button').addEventListener('click', () => {
  journalForm.style.display = 'none';
  journalEntries.style.display = 'grid';
  backButton.style.display = 'none';
});

function showFullEntry(index) {
  const entry = entries[index];
  fullEntryTitle.textContent = entry.title;
  fullEntryContent.textContent = entry.content;
  fullEntryDate.textContent = new Date(entry.date).toLocaleString();
  fullEntrySection.style.display = 'block';
  journalEntries.style.display = 'none';
  journalForm.style.display = 'none';
  backButton.style.display = 'block';
}

journalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const newEntry = {
    title,
    content,
    date: new Date().toISOString(),
    imagePath: getRandomImage() // Assign a random image path to new entries
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
  backButton.style.display = 'none';
});

