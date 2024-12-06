import {logOut} from './logOut';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from 'expo-router';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    removeItem: jest.fn(() => Promise.resolve()),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
    },
}));

// Mock console functions
jest.spyOn(global.console, 'log').mockImplementation(() => {
});
jest.spyOn(global.console, 'error').mockImplementation(() => {
});

describe('logOut', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('removes the current user and navigates to home', async () => {

        // act
        await logOut();

        // assert
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('currentUser');
        expect(router.push).toHaveBeenCalledWith('/');
        expect(console.log).toHaveBeenCalledWith('User logged out successfully.');
    });

    it('logs an error if removeItem fails', async () => {

        // setup: mock error from AsyncStorage
        (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(new Error('Async Error'));

        // act
        await logOut();

        // assert
        expect(console.error).toHaveBeenCalledWith('Failed to log out:', expect.any(Error));
        expect(router.push).not.toHaveBeenCalled();
    });
});
