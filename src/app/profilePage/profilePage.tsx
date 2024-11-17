import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logOut } from '../logOut';
import './styles.css';

const ProfilePage: React.FC = () => {
    const [avatarName, setAvatarName] = useState(''); // State for new avatar name
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF'); // Default background color
    const [userName, setUserName] = useState('John Doe'); // State for displayed user name
    const router = useRouter();

    const userInfo = {
        email: localStorage.getItem('email'),
        coins: 120,
        streak: 15,
        exp: 950,
    };

    // Load saved background color on page load
    useEffect(() => {
        const loadBackgroundColor = async () => {
            try {
                const savedColor = await AsyncStorage.getItem('backgroundColor');
                if (savedColor) {
                    setBackgroundColor(savedColor); // Set the color if it's saved
                }
            } catch (error) {
                console.error('Failed to load background color from AsyncStorage', error);
            }
        };
        loadBackgroundColor();
    }, []);

    const updateAvatarName = () => {
        if (avatarName.trim() !== '') {
            setUserName(avatarName); // Update displayed name
            console.log(`Updated avatar name: ${avatarName}`);
        } else {
            console.warn('Avatar name cannot be empty.');
        }
    };

    const changeBackgroundColor = async (color: string) => {
        setBackgroundColor(color);

        try {
            await AsyncStorage.setItem('backgroundColor', color); // Save the color to AsyncStorage
            console.log(`Background color updated to: ${color}`);
        } catch (error) {
            console.error('Failed to save background color to AsyncStorage', error);
        }
    };

    const handleDelete = async () => {
        try {
            // Remove email and password from AsyncStorage
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('password');
            console.log('User logged out successfully.');
            router.push('/'); // Navigate back to the sign-in page or wherever needed
        } catch (error) {
            console.error('Failed to remove user data', error);
        }
    };

    const goToPage = (path: string) => {
        router.push(path as any);
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
        <div className="profile-container" style={{ backgroundColor }}>
            <h1>User Profile</h1>

            {/* Name, Coins, Streak, EXP Display */}
            <div className="user-info">
                <p><strong>Name:</strong> <span id="userName">{userName}</span></p>
                <p><strong>Email:</strong> <span id="userEmail">{userInfo.email}</span></p>
                <div className="coins-info">
                    <p><strong>Coins:</strong> <span id="userCoins">{userInfo.coins}</span></p>
                    <div className="coin-icon">
                        {/* Coin Icon */}
                    </div>
                </div>

                <div className="streak-info">
                    <p><strong>Streak:</strong> <span id="userStreak">{userInfo.streak}</span></p>
                    <div className="streak-icon">
                        {/* Streak Icon */}
                    </div>
                </div>
                <div className="exp-info">
                    <p><strong>EXP:</strong> <span id="userExp">{userInfo.exp}</span></p>
                    <div className="exp-icon">
                        {/* EXP Icon */}
                    </div>
                </div>
            </div>

            {/* Avatar Name Edit */}
            <div className="avatar-edit">
                <label htmlFor="avatarName">Edit Avatar Name:</label>
                <input
                    type="text"
                    id="avatarName"
                    placeholder="Enter new avatar name"
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                />
                <button style={buttonStyle} onClick={updateAvatarName}>Update Avatar Name</button>
            </div>

            {/* Background Color Change */}
            <div className="bg-color-change">
                <label htmlFor="bgColor">Choose Background Color:</label>
                <button style={buttonStyle} onClick={() => changeBackgroundColor('#99CA9C')}>Green</button>
                <button style={buttonStyle} onClick={() => changeBackgroundColor('#9FDDF9')}>Blue</button>
                <button style={buttonStyle} onClick={() => changeBackgroundColor('#FAC1BE')}>Pink</button>
            </div>

            {/* Go to Parental Homepage */}
            <div className="parental-link">
                <button style={buttonStyle} onClick={() => goToPage('../parentalPortal/parentalPortal')}>Parental Controls</button>
            </div>

            {/* Go to Homepage */}
            <div className="back-button">
                <button style={buttonStyle} onClick={() => goToPage('../homePage/homePage')}>Back 
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round" strokeLinejoin="round"
                            width="24" height="24"
                            strokeWidth="2">
                            <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
                            <path d="M10 12h4v4h-4z"></path>
                        </svg>
                    </div>
                </button>
            </div>

            {/* Log Out Button */}
            <button id="logout-button" style={buttonStyle} onClick={logOut}>
                Log Out 
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
                        <path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2"></path>
                        <path d="M15 12h-12l3 -3"></path>
                        <path d="M6 15l-3 -3"></path>
                    </svg>
                </div>
            </button>

            {/* Delete Button */}
            <button id="delete-button" style={buttonStyle} onClick={handleDelete}>
                Delete 
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
                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                        <path d="M9 12l6 0"></path>
                    </svg>
                </div>
            </button>
        </div>
    );
};

export default ProfilePage;
