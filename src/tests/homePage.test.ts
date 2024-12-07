import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { AuthContext } from '../app/AuthContext';
import { useRouter } from 'expo-router';
import HomePage from '../app/homePage';

// Mocking necessary functions and components
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('./utils/databaseSetUp', () => ({
  createNeo4jDriver: jest.fn(),
}));

// Mock the AuthContext to simulate the session token
const mockRouter = {
  push: jest.fn(),
};

const mockAuthContext = {
    sessionToken: 'mockSessionToken',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={mockAuthContext}>
        {children}
    </AuthContext.Provider>
);

describe('HomePage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  const setup = () => {
    // Provide a mock sessionToken via the AuthContext
    const value = { sessionToken: 'mockSessionToken' };

    return render(
      <AuthContext.Provider value={value}>
        <HomePage />
      </AuthContext.Provider>
    );
  };

  it('should render the home page and buttons according to the age restriction of the user', () => {
    setup();

    // Check if the page renders properly
    expect(screen.getByText('Journal')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
    expect(screen.getByText('Store')).toBeTruthy();
    expect(screen.getByText('Closet')).toBeTruthy();

    // Check if buttons respect the age restrictions (enable/disable based on mock data)
    expect(screen.queryByText('Chat')).toBeTruthy(); // should appear if enableChat is true in mock
    expect(screen.queryByText('Friends')).toBeTruthy(); // should appear if allowAddViewFriends is true in mock
  });

  it('should navigate to the journal page when the journal button is clicked', () => {
    setup();

    fireEvent.press(screen.getByText('Journal'));
    expect(mockRouter.push).toHaveBeenCalledWith('./journalPage/journalPage');
  });

  it('should navigate to the profile page when the profile button is clicked', () => {
    setup();

    fireEvent.press(screen.getByText('Profile'));
    expect(mockRouter.push).toHaveBeenCalledWith('./profilePage/profilePage');
  });

  it('should navigate to the store page when the store button is clicked', () => {
    setup();

    fireEvent.press(screen.getByText('Store'));
    expect(mockRouter.push).toHaveBeenCalledWith('./storePage/storePage');
  });

  it('should navigate to the closet page when the closet button is clicked', () => {
    setup();

    fireEvent.press(screen.getByText('Closet'));
    expect(mockRouter.push).toHaveBeenCalledWith('./closetPage/closetPage');
  });

  it('should navigate to the chat page when the chat button is clicked', () => {
    setup();

    // Mock the enableChat flag
    fireEvent.press(screen.getByText('Chat'));
    expect(mockRouter.push).toHaveBeenCalledWith('./chatPage/chatPage');
  });

  it('should navigate to the friends page when the friends button is clicked', () => {
    setup();

    // Mock the allowAddViewFriends flag
    fireEvent.press(screen.getByText('Friends'));
    expect(mockRouter.push).toHaveBeenCalledWith('./friendsPage/friendsPage');
  });
});
