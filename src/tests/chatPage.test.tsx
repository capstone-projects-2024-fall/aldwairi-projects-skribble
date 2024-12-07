import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import ChatPage from '../app/chatPage/chatPage';
import styles from '../app/chatPage/styles';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock useNavigation hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

// Mock styles for consistent styling
jest.mock('../app/chatPage/styles', () => ({
  container: {},
  keyboardContainer: {},
  header: {},
  backButton: {},
  backButtonText: {},
  headerTitleContainer: {},
  logo: {},
  resetButton: {},
  resetButtonText: {},
  messageList: {},
  messageContainer: {},
  userMessageContainer: {},
  botMessageContainer: {},
  userMessageText: {},
  botMessageText: {},
  inputContainer: {},
  input: {},
  sendButton: {},
  sendButtonText: {},
}));

describe('ChatPage Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
  });

  // Test initial render
  it('renders initial welcome message', () => {
    const { getByText } = render(
      <NavigationContainer>
        <ChatPage router={{} as any} />
      </NavigationContainer>
    );

    expect(getByText("Welcome to Skribble. How are you feeling today?")).toBeTruthy();
  });

  // Test sending a user message
  it('sends user message and receives bot response', async () => {
    const { getByPlaceholderText, getByText, getAllByText, debug } = render(
      <NavigationContainer>
        <ChatPage router={{} as any} />
      </NavigationContainer>
    );

    // Find input and send button
    const input = getByPlaceholderText("Share how you're feeling...");
    const sendButton = getByText('➤');

    // Type a message
    fireEvent.changeText(input, 'I feel sad today');
    fireEvent.press(sendButton);

    // Wait for bot response
    await waitFor(() => {
      const userMessages = getAllByText('I feel sad today');
      expect(userMessages.length).toBeGreaterThan(0);

      // Get all bot messages
      const allMessages = getAllByText(/.*/)
        .filter(message => 
          message.props.style === styles.botMessageText
        );

      // Check that there is at least one bot message after the user message
      const botMessages = allMessages.filter(
        message => message.props.children.toLowerCase().includes('sad') || 
                   message.props.children.toLowerCase().includes('feeling')
      );

      expect(botMessages.length).toBeGreaterThan(0);
    }, { timeout: 2000 });
  });

  // Test navigation back to home page
  it('navigates back to home page when back button is pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <ChatPage router={{} as any} />
      </NavigationContainer>
    );

    // Find and press back button
    const backButton = getByText('←');
    fireEvent.press(backButton);

    // Verify navigation was called
    expect(mockNavigation.navigate).toHaveBeenCalledWith('homePage');
  });

  // Test reset chat functionality
  it('resets chat when reset button is pressed', () => {
    const { getByPlaceholderText, getByText, getAllByText } = render(
      <NavigationContainer>
        <ChatPage router={{} as any} />
      </NavigationContainer>
    );

    // Send a message first
    const input = getByPlaceholderText("Share how you're feeling...");
    const sendButton = getByText('➤');

    fireEvent.changeText(input, 'Test message');
    fireEvent.press(sendButton);

    // Reset chat
    const resetButton = getByText('↻');
    fireEvent.press(resetButton);

    // Verify only initial welcome message remains
    const welcomeMessages = getAllByText("Welcome to Skribble. How are you feeling today?");
    expect(welcomeMessages.length).toBe(1);
  });

  // Test input field functionality
  it('updates input field correctly', () => {
    const { getByPlaceholderText } = render(
      <NavigationContainer>
        <ChatPage router={{} as any} />
      </NavigationContainer>
    );

    const input = getByPlaceholderText("Share how you're feeling...");

    fireEvent.changeText(input, 'Hello world');
    expect(input.props.value).toBe('Hello world');
  });

  // Test empty message not sending
  it('does not send empty message', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <NavigationContainer>
        <ChatPage router={{} as any} />
      </NavigationContainer>
    );

    const input = getByPlaceholderText("Share how you're feeling...");
    const sendButton = getByText('➤');

    // Try to send empty message
    fireEvent.changeText(input, '');
    fireEvent.press(sendButton);

    // Verify no new message was added
    const emptyMessage = queryByText('');
    expect(emptyMessage).toBeNull();
  });
});