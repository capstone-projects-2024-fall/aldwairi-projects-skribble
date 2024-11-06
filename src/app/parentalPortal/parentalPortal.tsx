import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import './styles.css';

const ParentalControlPanel: React.FC = () => {
    const router = useRouter();

    // State for email and controls
    const [email, setEmail] = useState('parent@example.com');
    const [newEmail, setNewEmail] = useState('');
    const [allowAddViewFriends, setAllowAddViewFriends] = useState(true);
    const [enableChat, setEnableChat] = useState(true);
    const [allowMediaSharing, setAllowMediaSharing] = useState(true);
    const [timeLimit, setTimeLimit] = useState(2); // Default 2 hours

    const changeEmail = () => {
        if (newEmail) {
            setEmail(newEmail);
            setNewEmail(''); // Clear input field after setting
            console.log(`Email changed to: ${email}`);
        }
    };

    const saveControls = () => {
        // Logic to save the parental controls
        console.log({
            allowAddViewFriends,
            enableChat,
            allowMediaSharing,
            timeLimit,
        });
    };

    const goToProfilePage = () => {
        router.push('/profilePage/profilePage');
    };

    return (
        <div className="control-panel-container">
            <h1>Parental Control Panel</h1>

            {/* Email Section */}
            <div className="email-section">
                <p><strong>Current Email:</strong> <span>{email}</span></p>
                <label htmlFor="newEmail">Change Email:</label>
                <input
                    type="email"
                    id="newEmail"
                    placeholder="Enter new email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
                <button onClick={changeEmail}>Change Email</button>
            </div>

            {/* Feature Controls */}
            <div className="controls-section">
                <h2>Feature Controls</h2>

                {/* Add/View Friends */}
                <div className="control-item">
                    <input
                        type="checkbox"
                        id="addViewFriends"
                        checked={allowAddViewFriends}
                        onChange={(e) => setAllowAddViewFriends(e.target.checked)}
                    />
                    <label htmlFor="addViewFriends">Allow Add/View Friends</label>
                </div>

                {/* Enable Chat Feature */}
                <div className="control-item">
                    <input
                        type="checkbox"
                        id="enableChat"
                        checked={enableChat}
                        onChange={(e) => setEnableChat(e.target.checked)}
                    />
                    <label htmlFor="enableChat">Enable Chat Feature</label>
                </div>

                {/* Allow Media Sharing */}
                <div className="control-item">
                    <input
                        type="checkbox"
                        id="mediaSharing"
                        checked={allowMediaSharing}
                        onChange={(e) => setAllowMediaSharing(e.target.checked)}
                    />
                    <label htmlFor="mediaSharing">Allow Media Sharing</label>
                </div>

                {/* Set Time Limits */}
                <div className="control-item">
                    <label htmlFor="timeLimit">Set Time Limit (hours per day):</label>
                    <input
                        type="number"
                        id="timeLimit"
                        min="0"
                        max="24"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                    />
                </div>

                <button onClick={saveControls}>Save Settings</button>
            </div>

            {/* Go to Profile Page */}
            <div className="back-button">
                <button onClick={goToProfilePage}>Back</button>
            </div>
        </div>
    );
};

export default ParentalControlPanel;
