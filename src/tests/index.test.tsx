import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthContext } from '../app/AuthContext';
import LogIn from '../app/index';
import { useRouter } from 'expo-router';
import createNeo4jDriver from '../app/utils/databaseSetUp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { Encryption } from '@/encryption/Encryption';

// Mocks
jest.mock('expo-router', () => ({
  useRouter: jest.fn()
}));

jest.mock('../app/utils/databaseSetUp', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn()
}));

jest.mock('react-native-uuid', () => ({
  v4: jest.fn(() => 'mock-uuid')
}));

jest.mock('@/encryption/Encryption', () => ({
  Encryption: {
    generateSalt: jest.fn(() => 'mock-salt'),
    generateKeyFromPassword: jest.fn(() => 'mock-key'),
    encrypt: jest.fn(() => ({ iv: 'mock-iv', ciphertext: 'mock-ciphertext' })),
    decrypt: jest.fn(() => 'password123')
  }
}));

describe('LogIn Component', () => {
  let mockRouter: { push: jest.Mock };
  let mockDriverSession: { run: jest.Mock; close: jest.Mock };
  let mockDriver: { session: jest.Mock; close: jest.Mock };
  let mockSetSessionToken: jest.Mock;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock router
    mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock Neo4j driver and session
    mockDriverSession = { 
      run: jest.fn(), 
      close: jest.fn() 
    };
    mockDriver = { 
      session: jest.fn(() => mockDriverSession),
      close: jest.fn() 
    };
    (createNeo4jDriver as jest.Mock).mockReturnValue(mockDriver);

    // Mock session run to return a successful result
    mockDriverSession.run.mockResolvedValue({
      records: [{}],
      summary: { counters: { containsUpdates: () => true } }
    });

    // Reset AsyncStorage mocks
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.getItem as jest.Mock).mockClear();

    // Setup mock session token setter
    mockSetSessionToken = jest.fn();
  });

  const renderComponent = () => {
    return render(
      <AuthContext.Provider value={{ setSessionToken: mockSetSessionToken }}>
        <LogIn />
      </AuthContext.Provider>
    );
  };

  describe('Sign Up Flow', () => {
    it('renders sign up form by default', () => {
      const { getAllByText, getByPlaceholderText } = renderComponent();
      
      expect(getByPlaceholderText('Email')).toBeTruthy();
      expect(getByPlaceholderText('Password')).toBeTruthy();
      expect(getByPlaceholderText('Birthday (YYYY-MM-DD)')).toBeTruthy();
      
      const signUpButtons = getAllByText('Sign Up');
      expect(signUpButtons.length).toBeGreaterThan(0);
    });

    it('validates email format during sign up', async () => {
      const { getByPlaceholderText, getAllByText, getByText } = renderComponent();
      
      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      const birthdayInput = getByPlaceholderText('Birthday (YYYY-MM-DD)');
      
      const signUpButtons = getAllByText('Sign Up');
      const signUpButton = signUpButtons[signUpButtons.length - 1]; 

      // Mock existing user check to return no users
      mockDriverSession.run.mockResolvedValueOnce({ records: [] });

      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(birthdayInput, '2000-01-01');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(getByText('Please enter a valid email address.')).toBeTruthy();
      });
    });

    it('requires parent email for users under 13', async () => {
      const { getByPlaceholderText, getAllByText, getByText } = renderComponent();
      
      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      const birthdayInput = getByPlaceholderText('Birthday (YYYY-MM-DD)');
      
      const signUpButtons = getAllByText('Sign Up');
      const signUpButton = signUpButtons[signUpButtons.length - 1]; 

      // Use a birthday that makes the user under 13
      const currentYear = new Date().getFullYear();
      const underThirteenBirthday = `${currentYear - 10}-01-01`;

      // Mock existing user check to return no users
      mockDriverSession.run.mockResolvedValueOnce({ records: [] });

      fireEvent.changeText(emailInput, 'younguser@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(birthdayInput, underThirteenBirthday);
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(getByText("Parent's email is required for users under 13.")).toBeTruthy();
      });
    });

    it('allows sign up for users under 13 with parent email', async () => {
      const { getByPlaceholderText, getAllByText } = renderComponent();
      
      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      const birthdayInput = getByPlaceholderText('Birthday (YYYY-MM-DD)');
      const parentEmailInput = getByPlaceholderText("Parent's Email (if under 13)");
      
      const signUpButtons = getAllByText('Sign Up');
      const signUpButton = signUpButtons[signUpButtons.length - 1]; 

      // Use a birthday that makes the user under 13
      const currentYear = new Date().getFullYear();
      const underThirteenBirthday = `${currentYear - 10}-01-01`;

      // Mock existing user check to return no users
      mockDriverSession.run.mockResolvedValueOnce({ records: [] });
      // Mock successful user creation
      mockDriverSession.run.mockResolvedValueOnce({ 
        records: [{ 
          get: jest.fn(() => ({
            email: 'younguser@example.com',
            parentEmail: 'parent@example.com'
          })) 
        }] 
      });

      fireEvent.changeText(emailInput, 'younguser@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(birthdayInput, underThirteenBirthday);
      fireEvent.changeText(parentEmailInput, 'parent@example.com');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(mockDriverSession.run).toHaveBeenCalledWith(
          expect.stringContaining('CREATE (u:User'),
          expect.objectContaining({
            email: 'younguser@example.com',
            parentEmail: 'parent@example.com',
            needsParentalControls: true
          })
        );
        expect(mockSetSessionToken).toHaveBeenCalledWith('mock-uuid');
        expect(mockRouter.push).toHaveBeenCalledWith('/homePage');
      });
    });

    it('prevents sign up with an email already in use', async () => {
      const { getByPlaceholderText, getAllByText, getByText } = renderComponent();
      
      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      const birthdayInput = getByPlaceholderText('Birthday (YYYY-MM-DD)');
      
      const signUpButtons = getAllByText('Sign Up');
      const signUpButton = signUpButtons[signUpButtons.length - 1]; 

      // Mock existing user check to return an existing user
      mockDriverSession.run.mockResolvedValueOnce({
        records: [{ 
          get: jest.fn(() => ({ email: 'existing@example.com' })) 
        }]
      });

      fireEvent.changeText(emailInput, 'existing@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(birthdayInput, '2000-01-01');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(getByText('Email already in use. Please sign in or use a different email.')).toBeTruthy();
      });

      // Verify that no user creation attempt was made
      expect(mockDriverSession.run).toHaveBeenCalledTimes(1);
      expect(mockSetSessionToken).not.toHaveBeenCalled();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe('Sign In Flow', () => {
    beforeEach(() => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('test@example.com') 
        .mockResolvedValueOnce(JSON.stringify({ iv: 'mock-iv', ciphertext: 'mock-ciphertext' }))
        .mockResolvedValueOnce('mock-salt'); 
    });

    it('switches to sign in form', () => {
      const { getByText, getAllByText } = renderComponent();
      
      const toggleButton = getByText('Already have an account? Sign In');
      fireEvent.press(toggleButton);

      const signInHeaders = getAllByText('Sign In');
      expect(signInHeaders.length).toBeGreaterThan(0);
    });

    it('handles sign in with stored credentials', async () => {
      const { getByText, getByPlaceholderText, getAllByText } = renderComponent();
      
      const toggleButton = getByText('Already have an account? Sign In');
      fireEvent.press(toggleButton);

      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      
      const signInButtons = getAllByText('Sign In');
      const signInButton = signInButtons[signInButtons.length - 1];

      // Mock user exists and password matches
      mockDriverSession.run.mockResolvedValueOnce({ 
        records: [{ 
          get: jest.fn(() => 'password123') 
        }] 
      });

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(mockSetSessionToken).toHaveBeenCalledWith('mock-uuid');
        expect(mockRouter.push).toHaveBeenCalledWith('/homePage');
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error for invalid credentials', async () => {
      const { getByText, getByPlaceholderText, getAllByText } = renderComponent();
      
      const toggleButton = getByText('Already have an account? Sign In');
      fireEvent.press(toggleButton);

      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      
      const signInButtons = getAllByText('Sign In');
      const signInButton = signInButtons[signInButtons.length - 1];

      // Mock failed sign-in with user found but wrong password
      mockDriverSession.run.mockResolvedValueOnce({ 
        records: [{ 
          get: jest.fn(() => 'different-password') 
        }] 
      });

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(getByText('Invalid password.')).toBeTruthy();
      });
    });
  });
});