import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

const HomePage: React.FC = () => {
    const router = useRouter();
    const [backgroundColor, setBackgroundColor] = useState<string>('');

    // Function to get a random background color
    const getRandomBackgroundColor = (): string => {
        const colors = ['#FFEBEE', '#E3F2FD', '#C8E6C9', '#FFF9C4', '#F1F8E9'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Function to make the background color a few shades darker
    const getDarkerShade = (color: string): string => {
        // Convert HEX to RGB
        const hex = color.replace('#', '');
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // Darken each component by 20% (you can adjust this percentage)
        r = Math.max(0, r - 30);
        g = Math.max(0, g - 30);
        b = Math.max(0, b - 30);

        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    // Load the background color from localStorage or set a new one
    useEffect(() => {
        const savedColor = localStorage.getItem('backgroundColor');
        if (savedColor) {
            setBackgroundColor(savedColor);
        } else {
            const randomColor = getRandomBackgroundColor();
            setBackgroundColor(randomColor);
            localStorage.setItem('backgroundColor', randomColor);
        }
    }, []);

    // Adjust the function to accept both string paths and Href types
    const goToPage = (page: string) => {
        router.push(page);
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
        <div className="home-container" style={{ backgroundColor }}>
            <div className="avatar">
                <img src="path/to/avatar.png" alt="User Avatar" />
            </div>

            <div className="button-container">
                <button style={buttonStyle} onClick={() => goToPage('./chatPage/chatPage')}>Chat Page</button>
                <button style={buttonStyle} onClick={() => goToPage('./closetPage/closetPage')}>Closet Page</button>
                <button style={buttonStyle} onClick={() => goToPage('./friendsPage/friendsPage')}>Friend Page</button>
                <button style={buttonStyle} onClick={() => goToPage('./profilePage/profilePage')}>Profile Page</button>
                <button style={buttonStyle} onClick={() => goToPage('./storePage/storePage')}>Store Page</button>
                <button style={buttonStyle} onClick={() => goToPage('./journalPage/journalPage')}>Journal Page</button>
            </div>
        </div>
    );
};

export default HomePage;
