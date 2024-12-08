import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import StorePage from '@/app/storePage/storePage';
import { AuthContext } from '@/app/AuthContext';
import createNeo4jDriver from "@/app/utils/databaseSetUp";
import { Alert } from 'react-native';

// mock database driver
jest.mock('@/app/utils/databaseSetUp', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    session: jest.fn(() => ({
      run: jest.fn((query) => {
        if (query.includes('MATCH (u:User)-[:OWNS]->(i:Item)')) {
          return Promise.resolve({
            records: [
              {
                get: (key) => {
                  if (key === 'items') {
                    return ['1', '2']; // Return the items the user owns
                  }
                  return null;
                },
              },
            ],
          });
        }
        // Default response for other queries (e.g., fetching coins)
        return Promise.resolve({
          records: [
            {
              get: (key) => {
                switch (key) {
                  case 'coins':
                    return '100';
                  case 'backgroundColor':
                    return '#FFFFFF';
                  default:
                    return null;
                }
              },
            },
          ],
        });
      }),
      close: jest.fn(),
    })),
    close: jest.fn(),
  })),
}));


// Mock useRouter
const mockRouter = {
  push: jest.fn(),
};
jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
}));

// mock alert
jest.spyOn(Alert, 'alert');

// mock authContext
const mockAuthContext = {
  sessionToken: 'mockSessionToken',
  setSessionToken: jest.fn(),
};

// wrapper def
const wrapper = ({ children }) => (
  <AuthContext.Provider value={mockAuthContext}>
    {children}
  </AuthContext.Provider>
);

// Tests
describe('StorePage', () => {

  // cleanup after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // see if user has an item
  it('should check if the user owns a specific item', async () => {
    const { } = render(<StorePage />, { wrapper });

    const mockSession = createNeo4jDriver().session();
    const queryResult = await mockSession.run(
      'MATCH (u:User)-[:OWNS]->(i:Item) WHERE u.sessionToken = $sessionToken RETURN i.item_id AS items',
      { sessionToken: 'mockSessionToken' }
    );

    expect(queryResult.records.length).toBeGreaterThan(0);
    const items = queryResult.records[0]?.get('items');
    expect(items).toContain('1');
    expect(items).not.toContain('3');
  });

  // make sure user has a specific number of coins
  it('should validate the user’s coin balance', async () => {
    const { } = render(<StorePage />, { wrapper });

    const mockSession = createNeo4jDriver().session();
    const queryResult = await mockSession.run(
      'MATCH (u:User) WHERE u.sessionToken = $sessionToken RETURN u.coins AS coins',
      { sessionToken: 'mockSessionToken' }
    );

    expect(queryResult.records.length).toBeGreaterThan(0);
    const coins = queryResult.records[0]?.get('coins');
    expect(coins).toBe('100');
  });

  // go back to home page from store
  it('should navigate to the home page when the Back button is pressed', () => {
    const { getByText } = render(<StorePage />, { wrapper });

    fireEvent.press(getByText('Back'));
    expect(mockRouter.push).toHaveBeenCalledWith('/homePage');
  });

  // go to closet page 
  it('should navigate to the closet page when the Closet button is pressed', () => {
    const { getByText } = render(<StorePage />, { wrapper });

    fireEvent.press(getByText('Closet'));
    expect(mockRouter.push).toHaveBeenCalledWith('/closetPage/closetPage');
  });

  // show item info/popup
  it('should show the correct modal when an item is selected', async () => {
    const { getByText, queryByText } = render(<StorePage />, { wrapper });

    // wait until blue wavy pants are rendered
    await waitFor(() => {
      expect(getByText('blue wavy pants')).toBeTruthy();
    });

    // select an item
    fireEvent.press(getByText('blue wavy pants'));

    await waitFor(() => {
      expect(queryByText('Confirm Purchase')).toBeTruthy();
    });
  });
});
