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
    const [backgroundColor, setBackgroundColor] = useState<string>('');

    // Load journal entries from localStorage on component mount
    useEffect(() => {
        const storedEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        setEntries(storedEntries);

        // Load and apply background color from localStorage
        const savedColor = localStorage.getItem('backgroundColor');
        if (savedColor) {
            setBackgroundColor(savedColor);
        } else {
            const randomColor = getRandomBackgroundColor();
            setBackgroundColor(randomColor);
            localStorage.setItem('backgroundColor', randomColor);
        }
    }, []);

    // Save journal entries to localStorage whenever they change
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

    // Function to get a random background color
    const getRandomBackgroundColor = (): string => {
        const colors = ['#FFEBEE', '#E3F2FD', '#C8E6C9', '#FFF9C4', '#F1F8E9'];
        return colors[Math.floor(Math.random() * colors.length)];
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

    // Function to get a darker shade of a given color
    const getDarkerShade = (color: string): string => {
        const hex = color.replace('#', '');
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // Darken each component by 20% (you can adjust this percentage)
        r = Math.max(0, r - 20);
        g = Math.max(0, g - 20);
        b = Math.max(0, b - 20);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const buttonStyle = {
        backgroundColor: getDarkerShade(backgroundColor),
        border: '2px solid white',
        borderRadius: '12px',
        color: 'white',
        padding: '10px 20px',
        fontSize: '16px',
        margin: '10px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    };

    return (
        <div id="journal-container" style={{ backgroundColor }}>
            <div className="logo-container">
                <img src="../assets/images/GreenPinkLogo.png" alt="SKRIBBLE Logo" className="logo-image" />
            </div>

            {/* New Entry Button */}
            {!isFormVisible && !currentEntry && (
                <div className="center-button-container">
                    <button id="new-entry-button" style={buttonStyle} onClick={showNewEntryForm}>
                        New Entry
                        <div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round" strokeLinejoin="round"
                                width="24" height="24"
                                strokeWidth="2">
                                <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"></path>
                                <path d="M13.5 6.5l4 4"></path>
                                <path d="M16 19h6"></path>
                                <path d="M19 16v6"></path>
                            </svg>
                        </div>
                    </button>
                </div>
            )}

            {/* New Entry Form */}
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
                            <button type="submit" style={buttonStyle}>
                                Save Entry
                                <div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        width="24" height="24"
                                        strokeWidth="2">
                                        <path d="M3 19c3.333 -2 5 -4 5 -6c0 -3 -1 -3 -2 -3s-2.032 1.085 -2 3c.034 2.048 1.658 2.877 2.5 4c1.5 2 2.5 2.5 3.5 1c.667 -1 1.167 -1.833 1.5 -2.5c1 2.333 2.333 3.5 4 3.5h2.5"></path>
                                        <path d="M20 17v-12c0 -1.121 -.879 -2 -2 -2s-2 .879 -2 2v12l2 2l2 -2z"></path>
                                        <path d="M16 7h4"></path>
                                    </svg>
                                </div>
                            </button>
                            <button
                                type="button"
                                style={buttonStyle}
                                onClick={() => setIsModalOpen(true)}
                            >
                                Select Prompt
                                <div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        width="24" height="24"
                                        strokeWidth="2">
                                        <path d="M3 12l3 0"></path>
                                        <path d="M12 3l0 3"></path>
                                        <path d="M7.8 7.8l-2.2 -2.2"></path>
                                        <path d="M16.2 7.8l2.2 -2.2"></path>
                                        <path d="M7.8 16.2l-2.2 2.2"></path>
                                        <path d="M12 12l9 3l-4 2l-2 4l-3 -9"></path>
                                    </svg>
                                </div>
                            </button>
                            <button
                                type="button"
                                style={buttonStyle}
                                onClick={cancelNewEntryForm}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* View Entry */}
            {!isFormVisible && currentEntry && (
                <div id="full-entry" className="full-entry">
                    <h3>{currentEntry.title}</h3>
                    <p>{currentEntry.content}</p>
                    <small>{new Date(currentEntry.date).toLocaleString()}</small>
                    <div className="button-container">
                        <button style={buttonStyle} onClick={handleBack}>
                            Back
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: '#F44336' }} // Red for delete button
                            onClick={() => showDeleteConfirmation(entries.indexOf(currentEntry))}
                        >
                            Delete Entry
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round" strokeLinejoin="round"
                                    width="24" height="24"
                                    strokeWidth="2">
                                    <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                                    <path d="M10 12l4 4m0 -4l-4 4"></path>
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* Journal Entries List */}
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

            {/* Writing Prompt Modal */}
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
                                    'What are you sad about?',
                                    'Take deep breaths for a bit...',
                                    'Close your eyes and meditate',
                                    'Bubble exercise: capture the bad thoughts in a bubble within your head and let them fly up!'
                                ].map((prompt, index) => (
                                    <button
                                        key={index}
                                        className="prompt-button"
                                        style={buttonStyle}
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

            {/* Delete Confirmation Modal */}
            {isDeleteConfirmVisible && (
                <div className="modal-overlay">
                    <div className="modal-content confirmation-modal">
                        <h3>Delete Entry</h3>
                        <p>Are you sure you want to delete this entry?</p>
                        <div className="button-container">
                            <button
                                style={{ ...buttonStyle, backgroundColor: '#F44336' }}
                                onClick={handleDeleteEntry}
                            >
                                Yes, Delete
                            </button>
                            <button
                                style={buttonStyle}
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
