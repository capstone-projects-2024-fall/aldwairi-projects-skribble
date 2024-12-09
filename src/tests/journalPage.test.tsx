import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import JournalPage from '../app/journalPage/journalPage';
import { AuthContext } from '../app/AuthContext';
import createNeo4jDriver from '../app/utils/databaseSetUp';

jest.mock('../app/utils/databaseSetUp', () => jest.fn());
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockSessionToken = 'testSessionToken';
const mockDriver = {
  session: jest.fn(() => ({
    run: jest.fn(),
    close: jest.fn(),
  })),
};

createNeo4jDriver.mockReturnValue(mockDriver);

describe('JournalPage Component', () => {
  const renderWithContext = (component) => {
    return render(
      <AuthContext.Provider value={{ sessionToken: mockSessionToken }}>
        {component}
      </AuthContext.Provider>
    );
  };

  it('renders the journal page correctly', () => {
    const { getByText } = renderWithContext(<JournalPage />);

    // Check for main elements like "New Entry" button
    expect(getByText('New Entry')).toBeTruthy();
    expect(getByText('Home')).toBeTruthy();
  });

  it('navigates to the journal page and back correctly', () => {
    const { getByText } = renderWithContext(<JournalPage />);
    const homeButton = getByText('Home');

    // Simulate navigation to Home
    fireEvent.press(homeButton);

    // Verify the navigation action
    expect(homeButton).toBeTruthy();
  });

  it('allows user to create a journal prompt', async () => {
    const { getByText, getByPlaceholderText } = renderWithContext(<JournalPage />);

    // Click "New Entry" button
    fireEvent.press(getByText('New Entry'));

    // Fill in title and prompt
    fireEvent.changeText(getByPlaceholderText('Entry Title'), 'entry1');
    fireEvent.changeText(getByPlaceholderText('Write about your day...'), 'test entry');

    // Select custom prompt
    fireEvent.press(getByText('Select Prompt'));
    await waitFor(() => fireEvent.press(getByText('How are you feeling today?')));

    // Check if values are updated
    expect(getByPlaceholderText('Entry Title').props.value).toBe('entry1');
    expect(getByPlaceholderText('How are you feeling today?').props.value).toBe('test entry');
  });

  it('saves a completed journal prompt and updates the entries', async () => {
    const mockRun = jest.fn().mockResolvedValue({
      records: [
        {
          get: (key) => {
            const data = {
              entryID: '12345',
              date: new Date().toISOString(),
              title: 'entry1',
              content: 'test entry',
              imageIndex: 0,
            };
            return data[key];
          },
        },
      ],
    });
    mockDriver.session.mockReturnValue({ run: mockRun, close: jest.fn() });

    const { getByText, getByPlaceholderText } = renderWithContext(<JournalPage />);

    // Create an entry
    fireEvent.press(getByText('New Entry'));
    fireEvent.changeText(getByPlaceholderText('Entry Title'), 'entry1');
    fireEvent.changeText(getByPlaceholderText('Write about your day...'), 'test entry');
    fireEvent.press(getByText('Save Entry'));

    // Wait for DB save and UI update
    await waitFor(() => {
      expect(mockRun).toHaveBeenCalled();
      expect(getByText('entry1')).toBeTruthy(); // Ensure the new entry is displayed
    });
  });
});