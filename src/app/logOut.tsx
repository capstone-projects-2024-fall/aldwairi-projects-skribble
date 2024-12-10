import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';

/**
 * Logs out the current user by removing the user data from AsyncStorage
 * and navigating the user back to the sign-in page.
 * 
 * @async
 * @returns {Promise<void>} Resolves when the user has been logged out successfully or rejects with an error.
 */
export const logOut = async () => {
    try {
        // Remove the current user data from AsyncStorage
        await AsyncStorage.removeItem('currentUser');
        console.log('User logged out successfully.');

        // Navigate back to the sign-in page
        router.push('/');
    } catch (error) {
        console.error('Failed to log out:', error);
    }
};
