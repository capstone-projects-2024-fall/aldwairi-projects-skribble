import React, { useState, useEffect } from 'react';
import './styles.css'; // Journal Page Styles
interface JournalEntry {
    title: string;
    content: string;
    date: string;
    imagePath: string;
}

const JournalPage = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
    const [currentDeleteIndex, setCurrentDeleteIndex] = useState<number | null>(null);
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const storedEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        setEntries(storedEntries);
    }, []);

    useEffect(() => {
        localStorage.setItem('journalEntries', JSON.stringify(entries));
    }, [entries]);

    const getRandomImage = (): string => {
        const images = [
            '../assets/images/bear/bear1.png',
            '../assets/images/bear/bear2.png',
            '../assets/images/bear/bear3.png',
            '../assets/images/bear/bear4.png',
            '../assets/images/bear/bear5.png'
        ];
        return images[Math.floor(Math.random() * images.length)];
    };

    const showNewEntryForm = () => {
        setIsFormVisible(true);
        setCurrentEntry(null); // Reset current entry when showing form
    };

    const cancelNewEntryForm = () => {
        setIsFormVisible(false);
        setSelectedPrompt(null); // Reset selected prompt when canceling
    };

    const saveEntry = (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const title = (form.elements.namedItem('title') as HTMLInputElement).value;
        const content = (form.elements.namedItem('content') as HTMLTextAreaElement).value;
        
        const newEntry: JournalEntry = {
            title,
            content,
            date: new Date().toISOString(),
            imagePath: getRandomImage(),
        };
        
        setEntries([newEntry, ...entries]);
        setIsFormVisible(false);
        setSelectedPrompt(null);
    };

    const handleViewEntry = (index: number) => {
        setCurrentEntry(entries[index]);
        setIsFormVisible(false); // Hide form when viewing an entry
    };

    const handleBack = () => {
        setCurrentEntry(null);
    };

    const showDeleteConfirmation = (index: number) => {
        setCurrentDeleteIndex(index);
        setIsDeleteConfirmVisible(true);
    };

    const hideDeleteConfirmation = () => {
        setIsDeleteConfirmVisible(false);
        setCurrentDeleteIndex(null);
    };

    const handleDeleteEntry = () => {
        if (currentDeleteIndex !== null) {
            const updatedEntries = entries.filter((_, index) => index !== currentDeleteIndex);
            setEntries(updatedEntries);
            setIsDeleteConfirmVisible(false);
            setCurrentDeleteIndex(null);
            setCurrentEntry(null);
        }
    };

    return (
        <div id="journal-container">
            <div className="logo-container">
                <img src="../assets/images/GreenPinkLogo.png" alt="SKRIBBLE Logo" className="logo-image" />
            </div>

            {!isFormVisible && !currentEntry && (
                <div className="center-button-container">
                    <button id="new-entry-button" onClick={showNewEntryForm}>
                        New Entry
                    </button>
                </div>
            )}

            {isFormVisible && (
                <div className="form-container">
                    <form id="journal-form" onSubmit={saveEntry}>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Entry Title"
                            required
                            className="form-input"
                        />
                        <textarea
                            id="content"
                            name="content"
                            placeholder={selectedPrompt || "Write about your day..."}
                            rows={5}
                            required
                            className="form-textarea"
                        />
                        <div className="button-container">
                            <button type="submit" className="styled-button">
                                Save Entry
                            </button>
                            <button
                                type="button"
                                className="styled-button"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Select Prompt
                            </button>
                            <button
                                type="button"
                                className="styled-button"
                                onClick={cancelNewEntryForm}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!isFormVisible && currentEntry && (
                <div id="full-entry" className="full-entry">
                    <h3>{currentEntry.title}</h3>
                    <p>{currentEntry.content}</p>
                    <small>{new Date(currentEntry.date).toLocaleString()}</small>
                    <div className="button-container">
                        <button className="styled-button" onClick={handleBack}>
                            Back
                        </button>
                        <button
                            className="styled-button delete-button"
                            onClick={() => showDeleteConfirmation(entries.indexOf(currentEntry))}
                        >
                            Delete Entry
                        </button>
                    </div>
                </div>
            )}

            {!isFormVisible && !currentEntry && (
                <div id="journal-entries">
                    {entries.map((entry, index) => (
                        <div
                            key={index}
                            className="journal-entry"
                            onClick={() => handleViewEntry(index)}
                        >
                            <img src={entry.imagePath} alt="Bear" className="entry-image" />
                            <h3 className="entry-title">{entry.title}</h3>
                            <small className="entry-date">
                                {new Date(entry.date).toLocaleDateString()}
                            </small>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Choose a Writing Prompt</h2>
                            <button
                                className="modal-close-button"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="prompt-list">
                                {[
                                    'How are you feeling today?',
                                    'What did you do today?',
                                    'Where did you go today?',
                                    'What are you sad about?'
                                ].map((prompt, index) => (
                                    <button
                                        key={index}
                                        className="prompt-button"
                                        onClick={() => {
                                            setSelectedPrompt(prompt);
                                            setIsModalOpen(false);
                                        }}
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteConfirmVisible && (
                <div className="modal-overlay">
                    <div className="modal-content confirmation-modal">
                        <h3>Delete Entry</h3>
                        <p>Are you sure you want to delete this entry?</p>
                        <div className="button-container">
                            <button
                                className="styled-button delete-button"
                                onClick={handleDeleteEntry}
                            >
                                Yes, Delete
                            </button>
                            <button
                                className="styled-button"
                                onClick={hideDeleteConfirmation}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JournalPage;