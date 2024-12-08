import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import FriendsPage from '../app/friendsPage/friendsPage';
import { AuthContext } from '../app/AuthContext';
import createNeo4jDriver from '../app/utils/databaseSetUp';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

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

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

const mockAuthContext = {
  sessionToken: 'mockSessionToken',
};

import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthContext.Provider value={mockAuthContext}>
    {children}
  </AuthContext.Provider>
);

// tests
describe('FriendsPage', () => {
  it('renders correctly', () => {
    const tree = render(<FriendsPage />, { wrapper }).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('handles friend search', async () => {
    const { getByPlaceholderText, getByText } = render(<FriendsPage />, { wrapper });

    fireEvent.changeText(getByPlaceholderText('Search friends'), 'New User');

    await waitFor(() => {
      expect(getByText('New User')).toBeTruthy(); 
    });
  });

  it('handles adding a friend', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<FriendsPage />, { wrapper });

    fireEvent.press(getByText('Add Friend'));

    fireEvent.changeText(getByPlaceholderText('Enter friend code'), 'friendCode123');

    fireEvent.press(getByText('Send'));

    await waitFor(() => {
      expect(queryByText('Enter friend code')).toBeNull();
      expect(queryByText('New User')).toBeTruthy();
    });
  });


  it('fetches user data successfully from the database', async () => {
    render(<FriendsPage />, { wrapper });

    await waitFor(() => {
      expect(createNeo4jDriver).toHaveBeenCalled();
    });


    const driverInstance = (createNeo4jDriver as jest.Mock).mock.results[0].value;
    expect(driverInstance.session().run).toHaveBeenCalled();
  });


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