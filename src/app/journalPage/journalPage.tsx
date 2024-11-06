import React, { useState, useEffect } from 'react';
import './styles.css'; // Journal Page Styles
interface JournalEntry {
    title: string;
    content: string;
    date: string;
    imagePath: string;
}

const JournalPage: React.FC = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
    const [currentDeleteIndex, setCurrentDeleteIndex] = useState<number | null>(null);
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null); // For modal prompt
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

    useEffect(() => {
        // Load journal entries from localStorage
        const storedEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        setEntries(storedEntries);
    }, []);

    useEffect(() => {
        // Store journal entries in localStorage whenever they change
        localStorage.setItem('journalEntries', JSON.stringify(entries));
    }, [entries]);

    const getRandomImage = (): string => {
        const images = ['../assets/images/bear/bear1.png', '../assets/images/bear/bear2.png', '../assets/images/bear/bear3.png', '../assets/images/bear/bear4.png', '../assets/images/bear/bear5.png'];
        return images[Math.floor(Math.random() * images.length)];
    };

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
        const newEntry: JournalEntry = {
            title,
            content,
            date: new Date().toISOString(),
            imagePath: getRandomImage(),
        };
        setEntries([newEntry, ...entries]);
        setIsFormVisible(false);
    };

    const handleDeleteEntry = () => {
        if (currentDeleteIndex !== null) {
            const updatedEntries = entries.filter((_, index) => index !== currentDeleteIndex);
            setEntries(updatedEntries);
            setIsDeleteConfirmVisible(false);
            setCurrentDeleteIndex(null);
        }
    };

    const handleViewEntry = (index: number) => {
        setCurrentEntry(entries[index]);
    };

    const handleBack = () => {
        setCurrentEntry(null);
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

    const showDeleteConfirmation = (index: number) => {
        setCurrentDeleteIndex(index);
        setIsDeleteConfirmVisible(true);
    };

    const hideDeleteConfirmation = () => {
        setIsDeleteConfirmVisible(false);
    };

    return (
        <div id="journal-container">
            {/* Logo Image */}
            <div className="logo-container">
                <img src="../assets/images/GreenPinkLogo.png" alt="SKRIBBLE Logo" className="logo-image" />
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
                        {/* Button to Open Prompt Modal */}
                        <button id="new-entry-button" onClick={openModal}>
                            Select Prompt
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
                    <div key={index} className="journal-entry" onClick={() => handleViewEntry(index)}>
                        <img src={entry.imagePath} alt="Bear" className="entry-image" />
                        <h3 className="entry-title">{entry.title}</h3>
                        <small className="entry-date">{new Date(entry.date).toLocaleDateString()}</small>
                    </div>
                ))}
            </div>

            {/* Full Entry View */}
            {currentEntry && (
                <div id="full-entry" className="full-entry">
                    <h3 id="full-entry-title">{currentEntry.title}</h3>
                    <p id="full-entry-content">{currentEntry.content}</p>
                    <small id="full-entry-date">{new Date(currentEntry.date).toLocaleString()}</small>
                    <button id="back-button" className="styled-button" onClick={handleBack}>
                        Back
                    </button>
                    <button id="delete-entry-button" className="styled-button" onClick={() => showDeleteConfirmation(entries.indexOf(currentEntry))}>
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
                        <button id="cancel-delete" onClick={hideDeleteConfirmation}>
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
                <div id="myModal" className={`modal ${isModalOpen ? 'show' : ''}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="close" onClick={closeModal}>&times;</span>
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

        </div>
    );
};

export default JournalPage;
