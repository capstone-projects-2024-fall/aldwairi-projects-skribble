import React, { useState } from 'react';
import './styles.css';

const JournalPage: React.FC = () => {
    const [selectedPrompt, setSelectedPrompt] = useState("How are you feeling today?");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [journalEntry, setJournalEntry] = useState("");

    const prompts = [
        "How are you feeling today?",
        "What did you do today?",
        "Where did you go today?",
        "What are you sad about?",
    ];

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const changePrompt = (prompt: string) => {
        setSelectedPrompt(prompt);
        closeModal();
    };

    return (
        <div className="center-container">
            <h2>Start Your Journal Entry</h2>
            <p>{selectedPrompt}</p>

            {/* Button to select a prompt */}
            <button onClick={openModal}>Select a Prompt</button>

            {/* Prompt Selection Modal */}
            {isModalOpen && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="close" onClick={closeModal}>&times;</span>
                            <h2>Select a Journal Prompt</h2>
                        </div>
                        <div className="modal-body">
                            <ul>
                                {prompts.map((prompt, index) => (
                                    <li key={index} onClick={() => changePrompt(prompt)}>{prompt}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Journal Entry Text Area */}
            <textarea
                rows={10}
                cols={50}
                placeholder="Write your thoughts here..."
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
            />
        </div>
    );
};

export default JournalPage;
