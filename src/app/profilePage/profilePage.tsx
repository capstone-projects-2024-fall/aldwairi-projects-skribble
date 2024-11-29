import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { avatar_list } from '../../assets/avatars/avatarAssets.js';
import './styles.css';

const ProfilePage: React.FC = () => {
    const [avatarName, setAvatarName] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const [userName, setUserName] = useState('John Doe');
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null); 
    const router = useRouter();

    const userInfo = {
        email: localStorage.getItem('email'),
        coins: 120,
        streak: 15,
        exp: 950,
    };

    useEffect(() => {
        const loadProfileData = async () => {
            try {
                const savedColor = await AsyncStorage.getItem('backgroundColor');
                if (savedColor) setBackgroundColor(savedColor);

                const savedAvatar = await AsyncStorage.getItem('selectedAvatar');
                if (savedAvatar) setSelectedAvatar(savedAvatar);
            } catch (error) {
                console.error('Failed to load profile data from AsyncStorage', error);
            }
        };
        loadProfileData();
    }, []);

    const updateAvatarName = () => {
        if (avatarName.trim() !== '') {
            setUserName(avatarName);
            console.log(`Updated avatar name: ${avatarName}`);
        } else {
            console.warn('Avatar name cannot be empty.');
        }
    };

    const changeBackgroundColor = async (color: string) => {
        setBackgroundColor(color);
        try {
            await AsyncStorage.setItem('backgroundColor', color);
        } catch (error) {
            console.error('Failed to save background color to AsyncStorage', error);
        }
    };

    const handleAvatarSelection = async (avatarId: string) => {
        setSelectedAvatar(avatarId);
        try {
            await AsyncStorage.setItem('selectedAvatar', avatarId); 
            console.log(`Avatar ${avatarId} selected.`);
        } catch (error) {
            console.error('Failed to save selected avatar to AsyncStorage', error);
        }
    };

    const buttonStyle = {
        backgroundColor: '#333',
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

            {/* User Info */}
            <div className="user-info">
                <p><strong>Name:</strong> {userName}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Coins:</strong> {userInfo.coins}</p>
                <p><strong>Streak:</strong> {userInfo.streak}</p>
                <p><strong>EXP:</strong> {userInfo.exp}</p>
            </div>
            
            {/* Avatar Selection */}
            <div className="avatar-selection">
                <h3>Select an Avatar:</h3>
                <div className="avatar-list">
                    {avatar_list.map((avatar) => (
                        <img
                            key={avatar.avatar_id}
                            src={avatar.avatar_image}
                            alt={`Avatar ${avatar.avatar_id}`}
                            className={`avatar-image ${selectedAvatar === avatar.avatar_id ? 'selected' : ''}`}
                            onClick={() => handleAvatarSelection(avatar.avatar_id)}
                            style={{
                                border: selectedAvatar === avatar.avatar_id ? '3px solid #FFD700' : '2px solid #CCC',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                width: '75px',
                                height: '75px',
                                margin: '10px',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Edit Avatar Name */}
            <div className="avatar-edit">
                <label>Edit Avatar Name:</label>
                <input
                    type="text"
                    placeholder="Enter new avatar name"
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                />
                <button style={buttonStyle} onClick={updateAvatarName}>Update Avatar Name</button>
            </div>

            {/* Background Color Change */}
            <div className="bg-color-change">
                <h3>Choose Background Color:</h3>
                <button style={buttonStyle} onClick={() => changeBackgroundColor('#99CA9C')}>Green</button>
                <button style={buttonStyle} onClick={() => changeBackgroundColor('#9FDDF9')}>Blue</button>
                <button style={buttonStyle} onClick={() => changeBackgroundColor('#FAC1BE')}>Pink</button>
            </div>
        </div>
    );
};

export default ProfilePage;
