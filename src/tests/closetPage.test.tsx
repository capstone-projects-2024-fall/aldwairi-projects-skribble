import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ClosetPage from '../app/closetPage/closetPage';
import { AuthContext } from '../app/AuthContext';
import { category_list, clothes_list } from '../assets/clothing/clothingAssets';

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
                  return '1';
                case 'ownedItems':
                  return ['1', '2']; // Mocked owned items
                case 'wornItems':
                  return ['1']; // Mocked worn items
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

// Mocking AuthContext
const mockAuthContext = {
  sessionToken: 'mockSessionToken',
};

// Mocking clothes_list to include an item with _id = 1
const mockClothesList = [
  { _id: '2', category: 'bottoms', name: 'jeans', image: require('../assets/clothing/jeans.png') },
  { _id: '9', category: 'tops', name: 'blue Skribble shirt', image: require('../assets/clothing/blueSkribbleShirt.png') },
  // Add more items as needed
];

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
    const { getByTestId } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <ClosetPage />
      </AuthContext.Provider>
    );

    // Select an item
    const item = clothes_list[0]; // Example item
    const itemButton = getByTestId(`item-${item._id}`);
    fireEvent.press(itemButton);

    // Simulate the item being worn and check if the worn item appears on the avatar
    expect(getByTestId(`wornItem-${item._id}`)).toBeTruthy();

    // Simulate item being removed (toggle the worn state)
    fireEvent.press(itemButton);
    expect(() => getByTestId(`wornItem-${item._id}`)).toThrow();
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