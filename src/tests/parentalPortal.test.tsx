import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ParentalPortal from '../app/parentalPortal/parentalPortal';
import { AuthContext } from '../app/AuthContext';
import createNeo4jDriver from '../app/utils/databaseSetUp';
import { Alert } from 'react-native';

jest.mock('../app/utils/databaseSetUp', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
        session: jest.fn().mockReturnValue({
            run: jest.fn().mockResolvedValue({}),
            close: jest.fn(),
        }),
    }),
}));

jest.spyOn(Alert, 'alert');

const mockAuthContext = {
    sessionToken: 'mockSessionToken',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={mockAuthContext}>
        {children}
    </AuthContext.Provider>
);

describe('ParentalPortal Component', () => {
    // Test 1: Renders the parental portal page correctly
    it('renders the parental portal page correctly', () => {
        const { getByText } = render(<ParentalPortal />, { wrapper });

        // Check if key elements exist in the component
        expect(getByText('Change Email')).toBeTruthy();
        expect(getByText('Allow Add/View Friends')).toBeTruthy();
        expect(getByText('Enable Chat Feature')).toBeTruthy();
        expect(getByText('Set Time Limit (hours per day):')).toBeTruthy();
    });

    it('matches the snapshot', () => {
        const { toJSON } = render(<ParentalPortal />, { wrapper });

        // Generate and match snapshot
        expect(toJSON()).toMatchSnapshot();
    });

    // Test 2: Buttons and toggles are interactable
    it('confirms buttons and toggles are interactable', () => {
        const { getByText, getByLabelText } = render(<ParentalPortal />, { wrapper });

        // Simulate pressing the "Change Email" button
        fireEvent.press(getByText('Change Email'));

        // Simulate toggling a switch
        const friendsToggle = getByLabelText('Allow Add/View Friends');
        fireEvent(friendsToggle, 'valueChange', true); // For toggle switches, use 'valueChange'
    });


    // Test 3: Changing parent email
    it('allows changing the parent email', async () => {
        const { getByPlaceholderText, getByText } = render(<ParentalPortal />, { wrapper });

        const emailInput = getByPlaceholderText('Enter new email');
        const changeEmailButton = getByText('Change Email');

        // Simulate entering a new email
        fireEvent.changeText(emailInput, 'newparentemail@example.com');

        // Simulate pressing the button
        fireEvent.press(changeEmailButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Email updated successfully');
        });
    });


    // Test 4: Toggle "Allow Add/View Friends"
    it('toggles "Allow Add/View Friends"', async () => {
        const { getByLabelText } = render(<ParentalPortal />, { wrapper });

        const friendsToggle = getByLabelText('Allow Add/View Friends');

        // Simulate toggling the switch on
        fireEvent(friendsToggle, 'valueChange', true);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Settings updated', 'Friends view toggled.');
        });
    });

    // Test 5: Enable "Chat Feature"
    it('toggles "Enable Chat Feature"', async () => {
        const { getByLabelText } = render(<ParentalPortal />, { wrapper });

        const chatToggle = getByLabelText('Enable Chat Feature');

        // Simulate toggling the switch on
        fireEvent(chatToggle, 'valueChange', true);

        await waitFor(() => {
          expect(Alert.alert).toHaveBeenCalledWith('Settings updated', 'Chat feature toggled.');
        });
      });

    // Test 6: Toggle "Allow Media Sharing"
    it('toggles "Allow Media Sharing"', async () => {
        const { getByLabelText } = render(<ParentalPortal />, { wrapper });

        const mediaSharingToggle = getByLabelText('Allow Media Sharing');

        // Simulate toggling the switch on
        fireEvent(mediaSharingToggle, 'valueChange', true);

        await waitFor(() => {
          expect(Alert.alert).toHaveBeenCalledWith('Settings updated', 'Media Sharing toggled.');
        });
      });


    // Test 7: Change time limit in the field
    it('allows changing the time limit', async () => {
        const { getByLabelText, getByText } = render(<ParentalPortal />, { wrapper });

        const timeLimitField = getByLabelText('Set Time Limit (hours per day):');
        const saveButton = getByText('Save Time Limit');

        fireEvent.changeText(timeLimitField, '2');
        fireEvent.press(saveButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Settings updated', 'Time limit set to 2 hours.');
        });
    });
});
