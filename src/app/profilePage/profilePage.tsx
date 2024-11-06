import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import './styles.css';

const ProfilePage: React.FC = () => {
    const [avatarName, setAvatarName] = useState(''); // State for new avatar name
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF'); // Default background color
    const [userName, setUserName] = useState('John Doe'); // State for displayed user name
    const router = useRouter();

    const userInfo = {
        email: 'john@example.com',
        coins: 120,
        streak: 15,
        exp: 950,
    };

    const updateAvatarName = () => {
        if (avatarName.trim() !== '') {
            setUserName(avatarName); // Update displayed name
            console.log(`Updated avatar name: ${avatarName}`);

            // Optionally: Save to local storage or an API
            // localStorage.setItem('userName', avatarName);
            // or make an API call here
        } else {
            console.warn('Avatar name cannot be empty.');
        }
    };

    const changeBackgroundColor = (color: string) => {
        setBackgroundColor(color);
    };

    const goToPage = (path: string) => {
        router.push(path);
    };

    return (
        <div className="profile-container" style={{ backgroundColor }}>
            <h1>User Profile</h1>

            {/* Name, Coins, Streak, EXP Display */}
            <div className="user-info">
                <p><strong>Name:</strong> <span id="userName">{userName}</span></p>
                <p><strong>Email:</strong> <span id="userEmail">{userInfo.email}</span></p>
                <p><strong>Coins:</strong> <span id="userCoins">{userInfo.coins}</span></p>
                <p><strong>Streak:</strong> <span id="userStreak">{userInfo.streak}</span></p>
                <p><strong>EXP:</strong> <span id="userExp">{userInfo.exp}</span></p>
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
                <button onClick={updateAvatarName}>Update Avatar Name</button>
            </div>

            {/* Background Color Change */}
            <div className="bg-color-change">
                <label htmlFor="bgColor">Choose Background Color:</label>
                <button onClick={() => changeBackgroundColor('#99CA9C')}>Green</button>
                <button onClick={() => changeBackgroundColor('#9FDDF9')}>Blue</button>
                <button onClick={() => changeBackgroundColor('#FAC1BE')}>Pink</button>
            </div>

            {/* Go to Parental Homepage */}
            <div className="parental-link">
                <button onClick={() => goToPage('../parentalPortal/parentalPortal')}>Parental Controls</button>
            </div>

            {/* Go to Homepage */}
            <div className="back-button">
                <button onClick={() => goToPage('../homePage')}>Back</button>
            </div>
        </div>
    );
};

export default ProfilePage;
