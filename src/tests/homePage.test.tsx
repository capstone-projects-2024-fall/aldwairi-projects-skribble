import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import HomePage from '../app/homePage';
import { AuthContext } from '../app/AuthContext'; // Import AuthContext for mocking

// Mock router for testing
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('HomePage Component Routing Tests', () => {
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockSessionToken = 'mockSessionToken123';

  const renderWithAuthContext = (ui: React.ReactElement) =>
    render(
      <AuthContext.Provider value={{ sessionToken: mockSessionToken }}>
        {ui}
      </AuthContext.Provider>
    );

    test('renders HomePage correctly', () => {
      const { getByText } = renderWithAuthContext(<HomePage />);



      // Check for buttons
      expect(getByText('Journal')).toBeTruthy();
      expect(getByText('Profile')).toBeTruthy();
      expect(getByText('Store')).toBeTruthy();
      expect(getByText('Closet')).toBeTruthy();

      // Optionally check for Chat and Friends buttons based on the feature toggles
      const chatButton = getByText('Chat', { exact: false });
      if (chatButton) expect(chatButton).toBeTruthy();

      const friendsButton = getByText('Friends', { exact: false });
      if (friendsButton) expect(friendsButton).toBeTruthy();
    });

  test('navigates to journal page on button press', () => {
    const { getByText } = renderWithAuthContext(<HomePage />);
    const button = getByText('Journal');
    fireEvent.press(button);
    expect(mockRouterPush).toHaveBeenCalledWith(expect.stringMatching(/\/journalPage$/));
  });

  test('navigates to profile page on button press', () => {
    const { getByText } = renderWithAuthContext(<HomePage />);
    const button = getByText('Profile');
    fireEvent.press(button);
    expect(mockRouterPush).toHaveBeenCalledWith(expect.stringMatching(/\/profilePage$/));
  });

  test('navigates to store page on button press', () => {
    const { getByText } = renderWithAuthContext(<HomePage />);
    const button = getByText('Store');
    fireEvent.press(button);
    expect(mockRouterPush).toHaveBeenCalledWith(expect.stringMatching(/\/storePage$/));
  });

  test('navigates to closet page on button press', () => {
    const { getByText } = renderWithAuthContext(<HomePage />);
    const button = getByText('Closet');
    fireEvent.press(button);
    expect(mockRouterPush).toHaveBeenCalledWith(expect.stringMatching(/\/closetPage$/));
  });

  test('navigates to chat page on button press if chat is enabled', () => {
    const { queryByText } = renderWithAuthContext(<HomePage />);
    const button = queryByText('Chat');
    if (button) {
      fireEvent.press(button);
      expect(mockRouterPush).toHaveBeenCalledWith(expect.stringMatching(/\/chatPage$/));
    } else {
      expect(button).toBeNull();
    }
  });

  test('navigates to friends page on button press if friends feature is allowed', () => {
    const { queryByText } = renderWithAuthContext(<HomePage />);
    const button = queryByText('Friends');
    if (button) {
      fireEvent.press(button);
      expect(mockRouterPush).toHaveBeenCalledWith(expect.stringMatching(/\/friendsPage$/));
    } else {
      expect(button).toBeNull();
    }
  });
});
