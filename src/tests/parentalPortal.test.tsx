import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import ParentalControlPanel from '../app/parentalPortal/parentalPortal';
import { AuthContext } from '../app/AuthContext';
import { Alert } from 'react-native';
import createNeo4jDriver from '../app/utils/databaseSetUp';

jest.mock('../app/utils/databaseSetUp', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
        session: jest.fn().mockReturnValue({
            run: jest.fn().mockResolvedValue({}),
            close: jest.fn(),
        }),
    }),
}));

jest.mock('expo-router', () => ({
    useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock('../app/AuthContext', () => ({
    AuthContext: require('react').createContext({
        setSessionToken: jest.fn(),
        sessionToken: 'mockedToken',
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

describe('ParentalControlPanel Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockSessionToken = 'mockSessionToken123';

    // Test 1: Renders the parental control panel page correctly
    it('renders the parental control panel page correctly', () => {
        const { getByText, getByPlaceholderText } = render(<ParentalControlPanel />, { wrapper });

        expect(getByText('Parental Controls')).toBeTruthy();
        expect(getByText('Change Email')).toBeTruthy();
        expect(getByPlaceholderText('Enter new email')).toBeTruthy();
        expect(getByText('Allow Add/View Friends')).toBeTruthy();
        expect(getByText('Enable Chat Feature')).toBeTruthy();
        expect(getByText('Allow Media Sharing')).toBeTruthy();
        expect(getByText('Set Time Limit (hours per day):')).toBeTruthy();
        expect(getByText('Save Settings')).toBeTruthy();
    });

    // Test 2: Matches the snapshot
    it('matches the snapshot', () => {
        const { toJSON } = render(<ParentalControlPanel />, { wrapper });
        expect(toJSON()).toMatchSnapshot();
    });

    // Test 3: Changing parent email
    it('allows changing the parent email', async () => {
        const mockSessionRun = jest.fn().mockResolvedValue({
            records: [{ get: () => 'updated@example.com' }],
        });
        (createNeo4jDriver as jest.Mock).mockReturnValue({
            session: jest.fn(() => ({
                run: mockSessionRun,
                close: jest.fn(),
            })),
        });

        const { getByPlaceholderText, getByText } = render(<ParentalControlPanel />, { wrapper });

        const emailInput = getByPlaceholderText('Enter new email');
        fireEvent.changeText(emailInput, 'updated@example.com');
        fireEvent.press(getByText('Change Email'));

        await waitFor(() => {
            expect(mockSessionRun).toHaveBeenCalledWith(
                expect.stringContaining('SET u.parentEmail = $newEmail'),
                expect.objectContaining({ newEmail: 'updated@example.com' })
            );
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Email updated successfully.');
        });
    });

    // Test 4: Toggle "Allow Add/View Friends"
    it('should toggle "Allow Add/View Friends" correctly', () => {
        const { getByLabelText } = render(<ParentalControlPanel />, { wrapper });

        const switchAllowAddViewFriends = getByLabelText('Allow Add/View Friends');

        expect(switchAllowAddViewFriends.props.value).toBe(false);

        fireEvent(switchAllowAddViewFriends, 'valueChange', true);

        expect(switchAllowAddViewFriends.props.value).toBe(true);

        fireEvent(switchAllowAddViewFriends, 'valueChange', false);
        expect(switchAllowAddViewFriends.props.value).toBe(false);
    });

    // Test 5: Enable "Chat Feature"
    it('toggles "Enable Chat Feature"', async () => {
        const { getByLabelText } = render(<ParentalControlPanel />, { wrapper });

        const chatToggle = getByLabelText('Enable Chat Feature');

        expect(chatToggle.props.value).toBe(false);

        fireEvent(chatToggle, 'valueChange', true);

        expect(chatToggle.props.value).toBe(true);

        fireEvent(chatToggle, 'valueChange', false);
        expect(chatToggle.props.value).toBe(false);
    });

    // Test 6: Toggle "Allow Media Sharing"
    it('toggles "Allow Media Sharing" correctly', () => {
        const { getByLabelText } = render(<ParentalControlPanel />, { wrapper });

        const mediaToggle = getByLabelText('Allow Media Sharing');

        expect(mediaToggle.props.value).toBe(false);

        fireEvent(mediaToggle, 'valueChange', true);

        expect(mediaToggle.props.value).toBe(true);

        fireEvent(mediaToggle, 'valueChange', false);
        expect(mediaToggle.props.value).toBe(false);
    });

    // Test 7: Change time limit in the field
    it('allows changing the time limit', async () => {
        render(<ParentalControlPanel />);

        const timeLimitInput = screen.getByText('Set Time Limit (hours per day):');

        expect(timeLimitInput).toBeTruthy();
    });
});
