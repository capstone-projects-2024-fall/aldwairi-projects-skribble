import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import FriendsPage from '../app/friendsPage/friendsPage';
import { AuthContext } from '../app/AuthContext';
import createNeo4jDriver from '../app/utils/databaseSetUp';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

// mock createNeo4jDriver
jest.mock('../app/utils/databaseSetUp', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    session: jest.fn().mockReturnValue({
      run: jest.fn().mockResolvedValue({
        records: [
          {
            get: jest.fn((key) => {
              switch (key) {
                case 'name':
                  return 'New User';
                case 'avatarImage':
                  return 'avatar1';
                case 'friendCode':
                  return 'friendCode123';
                default:
                  return null;
              }
            }),
          },
        ],
      }),
      close: jest.fn(),
    }),
  }),
}));

// mock useRouter
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// mock Alert
jest.spyOn(Alert, 'alert');

// mock for AuthContext
const mockAuthContext = {
  sessionToken: 'mockSessionToken',
};

// define wrapper
import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthContext.Provider value={mockAuthContext}>
    {children}
  </AuthContext.Provider>
);

// tests
describe('FriendsPage', () => {
  // 1. page renders correctly
  it('renders correctly', () => {
    const tree = render(<FriendsPage />, { wrapper }).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // 2. friends search feature
  it('handles friend search', async () => {
    const { getByPlaceholderText, getByText } = render(<FriendsPage />, { wrapper });

    // simulate entering a search query
    fireEvent.changeText(getByPlaceholderText('Search friends'), 'New User');

    // assumes 'New User' is a friend in the mock data
    await waitFor(() => {
      expect(getByText('New User')).toBeTruthy(); 
    });
  });

  // 3. add friend feature
  it('handles adding a friend', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<FriendsPage />, { wrapper });

    // simulate opening the add friend modal
    fireEvent.press(getByText('Add Friend'));

    // simulate entering a friend code
    fireEvent.changeText(getByPlaceholderText('Enter friend code'), 'friendCode123');

    // simulate submitting the friend request
    fireEvent.press(getByText('Send'));

    await waitFor(() => {
      // make sure modal is closed
      expect(queryByText('Enter friend code')).toBeNull();
      // ensure new friend is added to the friends list
      expect(queryByText('New User')).toBeTruthy();
    });
  });

  // 4. remove friend feature
  it('fetches user data successfully from the database', async () => {
    render(<FriendsPage />, { wrapper });

    await waitFor(() => {
      expect(createNeo4jDriver).toHaveBeenCalled();
    });

    // check if session run method is called at least once
    const driverInstance = (createNeo4jDriver as jest.Mock).mock.results[0].value;
    expect(driverInstance.session().run).toHaveBeenCalled();
  });

  // 5. check if user data is accessible
  it('shows alert on error while fetching user data', async () => {
    (createNeo4jDriver as jest.Mock).mockReturnValue({
      session: () => ({
        run: jest.fn().mockRejectedValue(new Error('Database error')), 
        close: jest.fn(),
      }),
    });

    render(<FriendsPage />, { wrapper });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Could not fetch user data.');
    });
  });
});