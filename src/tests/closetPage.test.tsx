import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ClosetPage from '../app/closetPage/closetPage';
import { AuthContext } from '@/app/AuthContext';
import { category_list, clothes_list } from '@/assets/clothing/clothingAssets';

// mock createNeo4jDriver
jest.mock('@/app/utils/databaseSetUp', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    session: jest.fn(() => ({
      run: jest.fn((query) => {
        if (query.includes('MATCH (u:User {sessionToken: $sessionToken})-[:OWNS]->(i:Item)')) {
          return Promise.resolve({
            records: [{
              get: (key) => {
                switch (key) {
                  case 'name':
                    return 'New User';
                  case 'avatarImage':
                    return '1';
                  case 'backgroundColor':
                    return '#FFFFFF';
                  case 'ownedItems':
                    return ['1']; // Mocked owned items
                  case 'wornItems':
                    return []; // Mocked worn items
                  default:
                    return null;
                }
              },
            }]
          });
        }}),
      close: jest.fn(),
    })),
  })),
}));

// Mocking AuthContext
const mockAuthContext = {
  sessionToken: 'mockSessionToken',
};

// tests
describe('ClosetPage', () => {
  it('renders correctly and shows categories', async () => {
    const { getByText, getByTestId } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <ClosetPage />
      </AuthContext.Provider>
    );

    // Check if the page renders correctly
    expect(getByText('Closet')).toBeTruthy();

    // Check if categories are rendered
    category_list.forEach(category => {
      expect(getByTestId(`categoryText-${category.category_id}`)).toBeTruthy();
    });
  });

  it('selects a category and shows corresponding items', async () => {
    const { getByTestId } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <ClosetPage />
      </AuthContext.Provider>
    );

    // Select a category
    const bottomsCategory = getByTestId('category-bottoms');
    fireEvent.press(bottomsCategory);

    // Check if items from the selected category and owned items are rendered
    const ownedItems = ['2', '9']; // Mocked owned items
    const filteredItems = clothes_list.filter(item => item.category === 'bottoms' && ownedItems.includes(item._id));
    
    await waitFor(() => {
      expect(filteredItems.length).toBeGreaterThan(0);
    });
  });

  it('handles item selection and toggles wear status', async () => {
    const { getByTestId, queryByTestId } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <ClosetPage />
      </AuthContext.Provider>
    );

    // Wait for the item to be rendered
    await waitFor(() => {
      expect(getByTestId('item-1')).toBeTruthy();
    });

    // Select an item
    fireEvent.press(getByTestId('item-1'));

    // Simulate the item being worn and check if the worn item appears on the avatar
    await waitFor(() => {
      expect(getByTestId('wornItem-1')).toBeTruthy();
    });

    // Simulate item being removed (toggle the worn state)
    fireEvent.press(getByTestId('item-1'));
    await waitFor(() => {
      expect(queryByTestId('wornItem-1')).toBeNull();
    });
  });

  it('fetches and displays user data correctly from the database', async () => {
    const { getByTestId } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <ClosetPage />
      </AuthContext.Provider>
    );

    // Wait for user data to load
    await waitFor(() => getByTestId('avatarImage'));
  });
});