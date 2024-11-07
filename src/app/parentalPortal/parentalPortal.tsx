import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './styles.css';

const ParentalControlPanel: React.FC = () => {
    const router = useRouter();

    // Initial state setup with default values
    const [email, setEmail] = useState('parent@example.com');
    const [newEmail, setNewEmail] = useState('');
    const [allowAddViewFriends, setAllowAddViewFriends] = useState(true);
    const [enableChat, setEnableChat] = useState(true);
    const [allowMediaSharing, setAllowMediaSharing] = useState(true);
    const [timeLimit, setTimeLimit] = useState(2); // Default 2 hours
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF'); // Default background color

    // Use Effect to load saved settings from AsyncStorage
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('email');
                const savedAllowAddViewFriends = await AsyncStorage.getItem('allowAddViewFriends');
                const savedEnableChat = await AsyncStorage.getItem('enableChat');
                const savedAllowMediaSharing = await AsyncStorage.getItem('allowMediaSharing');
                const savedTimeLimit = await AsyncStorage.getItem('timeLimit');
                const savedBackgroundColor = await AsyncStorage.getItem('backgroundColor');

                if (savedEmail) setEmail(savedEmail);
                if (savedAllowAddViewFriends !== null) setAllowAddViewFriends(JSON.parse(savedAllowAddViewFriends));
                if (savedEnableChat !== null) setEnableChat(JSON.parse(savedEnableChat));
                if (savedAllowMediaSharing !== null) setAllowMediaSharing(JSON.parse(savedAllowMediaSharing));
                if (savedTimeLimit) setTimeLimit(Number(savedTimeLimit));
                if (savedBackgroundColor) setBackgroundColor(savedBackgroundColor); // Apply the saved background color
            } catch (error) {
                console.error('Failed to load settings from AsyncStorage:', error);
            }
        };

        loadSettings();
    }, []); // Empty dependency array means this runs only once on component mount

    // Change the email address
    const changeEmail = () => {
        if (newEmail) {
            setEmail(newEmail);
            setNewEmail(''); // Clear input field after setting
            console.log(`Email changed to: ${email}`);
        }
    };

    // Save all settings including background color
    const saveControls = async () => {
        try {
            // Save the parental controls to AsyncStorage
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('allowAddViewFriends', JSON.stringify(allowAddViewFriends));
            await AsyncStorage.setItem('enableChat', JSON.stringify(enableChat));
            await AsyncStorage.setItem('allowMediaSharing', JSON.stringify(allowMediaSharing));
            await AsyncStorage.setItem('timeLimit', timeLimit.toString());
            await AsyncStorage.setItem('backgroundColor', backgroundColor); // Save background color

            console.log('Parental controls saved');
        } catch (error) {
            console.error('Failed to save settings to AsyncStorage:', error);
        }
    };

    // Function to handle background color change
    const changeBackgroundColor = async (color: string) => {
        setBackgroundColor(color);

        try {
            // Save the selected background color in AsyncStorage
            await AsyncStorage.setItem('backgroundColor', color);
            console.log(`Background color updated to: ${color}`);
        } catch (error) {
            console.error('Failed to save background color to AsyncStorage', error);
        }
    };

    const goToProfilePage = () => {
        // Optionally save the settings before navigating
        saveControls();
        router.push('/profilePage/profilePage');
    };

    // Function to get a darker shade of a given color
    const getDarkerShade = (color: string): string => {
        // Convert HEX to RGB
        const hex = color.replace('#', '');
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // Darken each component by 20% (you can adjust this percentage)
        r = Math.max(0, r - 20);
        g = Math.max(0, g - 20);
        b = Math.max(0, b - 20);

        // Convert back to hex
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
        <div className="control-panel-container" style={{ backgroundColor }}>
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
                <button style={buttonStyle} onClick={changeEmail}>Change Email</button>
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

                <button style={buttonStyle} onClick={saveControls}>Save Settings</button>
            </div>

            {/* Go to Profile Page */}
            <div className="back-button">
                <button style={buttonStyle} onClick={goToProfilePage}>Back</button>
            </div>
        </div>
    );
};

export default ParentalControlPanel;
