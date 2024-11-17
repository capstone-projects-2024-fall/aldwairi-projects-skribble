import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import './styles.css';

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
        const hex = color.replace('#', '');
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // Darken each component by 20% 
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

    // Function to navigate to another page
    const goToPage = (page: string) => {
        router.push(page as any);
    };

    // Button style based on background color
    const buttonStyle = {
        backgroundColor: getDarkerShade(backgroundColor),
    };

    return (
        <div
            className="home-container"
            style={{
                backgroundColor,
            }}
        >
            <div className="avatar">
                <img src="path/to/avatar.png" alt="User Avatar" />
            </div>

            <div className="button-container">
                <button 
                className="button" 
                style={buttonStyle} 
                onClick={() => goToPage('/chatPage/chatPage')}>
                    Chat
                    <div style={{ marginLeft: '10px' }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="24"
                            height="24"
                            strokeWidth="2"
                        >
                            <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"></path>
                            <path d="M9.5 9h.01"></path>
                            <path d="M14.5 9h.01"></path>
                            <path d="M9.5 13a3.5 3.5 0 0 0 5 0"></path>
                        </svg>
                    </div>
                </button>
                <button 
                className="button" 
                style={buttonStyle} 
                onClick={() =>  goToPage('/closetPage/closetPage')}>
                    Closet
                    <div style={{ marginLeft: '10px' }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="24"
                            height="24"
                            strokeWidth="2"
                        >
                            <path d="M14 6a2 2 0 1 0 -4 0c0 1.667 .67 3 2 4h-.008l7.971 4.428a2 2 0 0 1 1.029 1.749v.823a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-.823a2 2 0 0 1 1.029 -1.749l7.971 -4.428"></path>
                        </svg>
                    </div>
                </button>
                <button 
                className="button" 
                style={buttonStyle} 
                onClick={() =>  goToPage('/friendsPage/friendsPage')}>
                    Friends
                    <div style={{ marginLeft: '10px' }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="24"
                            height="24"
                            strokeWidth="2"
                        >
                            <path d="M7 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                            <path d="M5 22v-5l-1 -1v-4a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4l-1 1v5"></path>
                            <path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                            <path d="M15 22v-4h-2l2 -6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1l2 6h-2v4"></path>
                        </svg>
                    </div>
                </button>
                <button 
                className="button" 
                style={buttonStyle} 
                onClick={() => goToPage('/profilePage/profilePage')}>
                    Profile
                    <div style={{ marginLeft: '10px' }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="24"
                            height="24"
                            strokeWidth="2"
                        >
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                            <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                            <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"></path>
                        </svg>
                    </div>
                </button>
                <button 
                className="button" 
                style={buttonStyle} 
                onClick={() =>  goToPage('/storePage/storePage')}>
                    Store
                    <div style={{ marginLeft: '10px' }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="24"
                            height="24"
                            strokeWidth="2"
                        >
                            <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                            <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                            <path d="M17 17h-11v-14h-2"></path>
                            <path d="M6 5l14 1l-1 7h-13"></path>
                        </svg>
                    </div>
                </button>
                <button 
                className="button" 
                style={buttonStyle} 
                onClick={() => goToPage('/journalPage/journalPage')}>
                    Journal
                    <div style={{ marginLeft: '10px' }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="24"
                            height="24"
                            strokeWidth="2"
                        >
                            <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18"></path>
                            <path d="M13 8l2 0"></path>
                            <path d="M13 12l2 0"></path>
                        </svg>
                    </div>
                    </button>
            </div>
        </div>
    );
};

export default HomePage;
