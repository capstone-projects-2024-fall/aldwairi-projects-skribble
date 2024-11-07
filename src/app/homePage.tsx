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
                <button onClick={() => goToPage('./chatPage/chatPage')}>Chat<div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        width="24" height="24"
                        stroke-width="2">
                        <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"></path> <path d="M9.5 9h.01"></path> <path d="M14.5 9h.01"></path> <path d="M9.5 13a3.5 3.5 0 0 0 5 0"></path>
                    </svg>
                </div>
                </button>
                <button onClick={() => goToPage('./closetPage/closetPage')}>Closet<div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        width="24" height="24"
                        stroke-width="2">
                        <path d="M14 6a2 2 0 1 0 -4 0c0 1.667 .67 3 2 4h-.008l7.971 4.428a2 2 0 0 1 1.029 1.749v.823a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-.823a2 2 0 0 1 1.029 -1.749l7.971 -4.428"></path>
                    </svg>
                </div></button>
                <button onClick={() => goToPage('./friendsPage/friendsPage')}>Friends<div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        width="24" height="24"
                        stroke-width="2">
                        <path d="M7 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path> <path d="M5 22v-5l-1 -1v-4a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4l-1 1v5"></path> <path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path> <path d="M15 22v-4h-2l2 -6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1l2 6h-2v4"></path>
                    </svg> </div>
                </button>
                <button onClick={() => goToPage('./profilePage/profilePage')}>Profile<div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        width="24" height="24"
                        stroke-width="2"> <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path> <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path> <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"></path>
                    </svg>
                </div>
                </button>
                <button onClick={() => goToPage('./storePage/storePage')}>Store<div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round"
                        width="24" height="24"
                        stroke-width="2"> <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path> <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path> <path d="M17 17h-11v-14h-2"></path> <path d="M6 5l14 1l-1 7h-13"></path> </svg>
                </div>
                </button>
                <button onClick={() => goToPage('./journalPage/journalPage')}>Journal<div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        width="24" height="24"
                        stroke-width="2">
                        <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18"></path> <path d="M13 8l2 0"></path> <path d="M13 12l2 0"></path> </svg>
                </div>
                </button>
            </div>
        </div>
    );
};

export default HomePage;
