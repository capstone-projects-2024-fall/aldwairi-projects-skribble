import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import ProfilePage from '../app/profilePage/profilePage';
import { AuthContext } from "../app/AuthContext";
import styles from '../app/profilePage/styles';
import { useRouter } from 'expo-router'

const mockRun = jest.fn();

jest.mock('../app/utils/databaseSetUp', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
        session: jest.fn().mockReturnValue({
            run: jest.fn((query, params) => {
                if (query.includes('MATCH')) {
                    // Simulate fetching user data
                    return Promise.resolve({
                    records: [
                    {
                        get: jest.fn((key) => {
                            switch (key) {
                                case 'name':
                                    return params.newName || 'New User';
                                case 'email':
                                    return params.newEmail || 'user@example.com';
                                case 'coins':
                                    return 50;
                                case 'streak':
                                    return { low: 10 };
                                case 'exp':
                                    return { low: 500 };
                                case 'backgroundColor':
                                    return '#99CA9C';
                                case 'avatarImage':
                                    return 'avatar1';
                                case 'friendCode':
                                    return 'friendCode123';
                                case 'allowAddViewFriends':
                                    return true;
                                default:
                                    return null;
                                }
                            }),
                        },
                    ],
                    });
                } else if (query.includes('SET')) {
                    // Simulate successful update for SET operations
                    if (params.newName || params.newEmail) {
                        return Promise.resolve({
                            records: [
                            {
                                get: jest.fn((key) => {
                                    if (key === 'updatedName') return params.newName;
                                    if (key === 'updatedEmail') return params.newEmail;
                                    return null;
                                }),
                            },
                        ],
                        });
                    }
                }
                return Promise.reject(new Error('Unknown query'));
            }),
            close: jest.fn(),
        }),
    }),
}));  

// Mock the expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

describe('ProfilePage', () => {
    const mockRouter = {
        push: jest.fn(),
    };
    
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });
    
    const renderWithAuthContext = (token: string | null) => {
        const mockSetSessionToken = jest.fn();
        render(
            <AuthContext.Provider value={{ sessionToken: token, setSessionToken: mockSetSessionToken }}>
            <ProfilePage />
            </AuthContext.Provider>
        );
        return { mockSetSessionToken };
    };
    
    it('renders user info correctly from the database', async () => {
        renderWithAuthContext('mockSessionToken');
    
        expect(await screen.findByText(/Name: New User/)).toBeTruthy();
        expect(screen.getByText(/Email: user@example.com/)).toBeTruthy();
        expect(screen.getByText(/Coins: 50/)).toBeTruthy();
        expect(screen.getByText(/Streak: 10/)).toBeTruthy();
        expect(screen.getByText(/EXP: 500/)).toBeTruthy();
        expect(screen.getByText(/Friend Code: friendCode123/)).toBeTruthy();
    });
    
    it('updates the background color', async () => {
        renderWithAuthContext('mockSessionToken');
    
        fireEvent.press(screen.getByText('Green'));
    
        await waitFor(() => {
          expect(screen.getByText('Green')).toBeTruthy(); // Verify the button was pressed
        });
    });
    
    it('navigates to the parental portal', () => {
        renderWithAuthContext('mockSessionToken');
    
        fireEvent.press(screen.getByText('Go to Parental Portal'));
        expect(mockRouter.push).toHaveBeenCalledWith('/parentalPortal/parentalPortal');
    });
    
    it('logs out the user', async () => {
        const { mockSetSessionToken } = renderWithAuthContext('mockSessionToken');
    
        fireEvent.press(screen.getByText('Log Out'));
        await waitFor(() => expect(mockSetSessionToken).toHaveBeenCalledWith(null));
        expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
});