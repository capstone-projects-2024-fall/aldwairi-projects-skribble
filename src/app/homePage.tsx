import React from 'react';
import { Stack, useRouter, Href } from 'expo-router';

const HomePage: React.FC = () => {
    const router = useRouter();

    // Adjust the function to accept both string paths and Href types
    const goToPage = (page: string) => {
        router.push(page);
    };

    return (
        <div className="home-container"> 
            <div className="avatar">
                <img src="path/to/avatar.png" alt="User Avatar" />
            </div>

            <div className="button-container">
                <button onClick={() => goToPage('/chatPage')}>Chat Page</button>
                <button onClick={() => goToPage('/closetPage')}>Closet Page</button>
                <button onClick={() => goToPage('/friendsPage')}>Friend Page</button>
                <button onClick={() => goToPage('./profilePage/profilePage')}>Profile Page</button>
                <button onClick={() => goToPage('/storePage')}>Store Page</button>
                <button onClick={() => goToPage('/uploadsPage')}>Journal Page</button>
            </div>
        </div>
    );
};

export default HomePage;
