import React, { useState } from 'react';
import './styles.css'; // Journal Page Styles

const JournalPage: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [currentEntry, setCurrentEntry] = useState<any | null>(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null); // Track selected prompt

  const showNewEntryForm = () => {
    setIsFormVisible(true);
  };

  const cancelNewEntryForm = () => {
    setIsFormVisible(false);
  };

  const saveEntry = (event: React.FormEvent) => {
    event.preventDefault();
    const title = (event.target as any).title.value;
    const content = (event.target as any).content.value;
    const newEntry = {
      title,
      content,
      date: new Date().toLocaleString(),
    };

    setEntries([...entries, newEntry]);
    setIsFormVisible(false);
  };

  const handleDeleteEntry = () => {
    if (currentEntry) {
      setEntries(entries.filter((entry) => entry !== currentEntry));
      setIsDeleteConfirmVisible(false);
      setCurrentEntry(null);
    }
  };

  const handleBack = () => {
    setCurrentEntry(null);
  };

  const handleViewEntry = (entry: any) => {
    setCurrentEntry(entry);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const selectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    closeModal();
  };

  return (
    <div id="journal-container">
      {/* Logo Image */}
      <div className="logo-container">
        <img src="src/GreenPinkLogo.png" alt="SKRIBBLE Logo" className="logo-image" />
      </div>

      {/* New Entry Button */}
      <div className="center-button-container">
        <button id="new-entry-button" onClick={showNewEntryForm}>
          New Entry
        </button>
      </div>

      {/* Journal Entry Form */}
      {isFormVisible && (
        <form id="journal-form" onSubmit={saveEntry}>
          <input type="text" id="title" placeholder="Entry Title" required />
          <textarea
            id="content"
            placeholder={`Write your journal entry about: ${selectedPrompt || "your day"}...`}
            rows={5}
            required
          />
          <div className="button-container">
            <button type="submit" className="styled-button">
              Save Entry
            </button>
            <button type="button" id="cancel-entry-button" className="styled-button" onClick={cancelNewEntryForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Journal Entries */}
      <div id="journal-entries">
        {entries.map((entry, index) => (
          <div key={index} className="journal-entry" onClick={() => handleViewEntry(entry)}>
            <h3>{entry.title}</h3>
            <p>{entry.content.slice(0, 100)}...</p>
            <small>{entry.date}</small>
          </div>
        ))}
      </div>

      {/* Full Entry View */}
      {currentEntry && (
        <div id="full-entry" className="full-entry">
          <h3 id="full-entry-title">{currentEntry.title}</h3>
          <p id="full-entry-content">{currentEntry.content}</p>
          <small id="full-entry-date">{currentEntry.date}</small>
          <button id="back-button" className="styled-button" onClick={handleBack}>
            Back
          </button>
          <button
            id="delete-entry-button"
            className="styled-button"
            onClick={() => setIsDeleteConfirmVisible(true)}
          >
            Delete Entry
          </button>
        </div>
      )}

      {/* Delete Confirmation Box */}
      {isDeleteConfirmVisible && (
        <div id="delete-confirm" className="confirm-box">
          <div className="confirm-content">
            <p>Are you sure you want to delete this entry?</p>
            <button id="confirm-delete" onClick={handleDeleteEntry}>
              Yes
            </button>
            <button
              id="cancel-delete"
              onClick={() => setIsDeleteConfirmVisible(false)}
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Log Out Button */}
      <button id="logout-button" style={{ display: entries.length > 0 ? 'block' : 'none' }}>
        Log Out
      </button>

      {/* Modal for Prompt Selection */}
      {isModalOpen && (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <h2>Select One of These Prompts to Get Started</h2>
            </div>
            <div className="modal-body">
              <ul>
                <li onClick={() => selectPrompt('How are you feeling today?')}>How are you feeling today?</li>
                <li onClick={() => selectPrompt('What did you do today?')}>What did you do today?</li>
                <li onClick={() => selectPrompt('Where did you go today?')}>Where did you go today?</li>
                <li onClick={() => selectPrompt('What are you sad about?')}>What are you sad about?</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Button to Open Prompt Modal */}
      <button id="myBtn" onClick={openModal}>
        Select Prompt
      </button>
    </div>
  );
};

export default JournalPage;
