import React, { useState, useEffect, useContext } from 'react';
import styles from './styles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Platform,
  Image,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import neo4j from 'neo4j-driver';
import { logo_list } from '../../assets/logos/logosAssets';
import createNeo4jDriver from '../utils/databaseSetUp';
import { getDarkerShade } from '../utils/colorUtils';
import { AuthContext } from "../AuthContext";

/**
 * `ParentalControlPanel` component allows a user (likely a parent) to manage various parental control settings.
 * The component retrieves the current settings from the database (Neo4j) using the session token,
 * displays the current settings, and provides options to modify them, such as updating the parent's email, 
 * toggling chat, friend addition, and media sharing permissions, and setting time limits for the child user.
 * 
 * The component supports a form where the user can update the email address and save parental control settings
 * directly to the Neo4j database. Changes are saved when the "Save Settings" button is pressed, and a confirmation
 * message appears for successful updates. Additionally, the component allows the user to navigate to the profile page
 * after saving changes.
 *
 * @component
 * @returns {JSX.Element} The rendered ParentalControlPanel component, which is a view containing the settings controls.
 */
const ParentalControlPanel: React.FC = () => {
    const router = useRouter();

    // Set up the Neo4j driver
    const driver = createNeo4jDriver();

    // Initial state setup with default values
    const [newEmail, setNewEmail] = useState('');
    const [allowAddViewFriends, setAllowAddViewFriends] = useState(false);
    const [enableChat, setEnableChat] = useState(false);
    const [allowMediaSharing, setAllowMediaSharing] = useState(false);
    const [timeLimit, setTimeLimit] = useState('2'); // Changed to string for TextInput
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const { setSessionToken, sessionToken } = useContext(AuthContext);
    const [parentInfo, setParentInfo] = useState({
        email: ""
      });

    /**
     * The `useEffect` hook is responsible for loading the user's parental control settings from the Neo4j database
     * when the component mounts or when the `sessionToken` changes. It queries the database to fetch settings such as
     * the parent's email, permissions for adding/viewing friends, enabling chat, media sharing, time limits, and the background color.
     * If the settings are successfully retrieved, they are stored in the component's state for rendering.
     * 
     * The hook runs the database query within an asynchronous function and updates the component state based on the query results.
     * If the settings cannot be loaded or there is an error during the process, the error is logged to the console.
     *
     * @effect
     * @function
     * @async
     * @param {void} 
     * @returns {void} No return value. The hook updates component state based on the fetched settings.
     */
    useEffect(() => {
        const loadSettings = async () => {
            const session = driver.session();
            try {
                const result = await session.run(
                    `MATCH (u:User {sessionToken: $sessionToken})
                     RETURN u.parentEmail AS parentEmail,
                            u.allowAddViewFriends AS allowAddViewFriends,
                            u.enableChat AS enableChat,
                            u.allowMediaSharing AS allowMediaSharing,
                            u.timeLimit AS timeLimit,
                            u.backgroundColor AS backgroundColor`,
                    { sessionToken }
                );

                if (result.records.length > 0) {;
                    const record = result.records[0];
                    const backgroundColor = record.get("backgroundColor");
                    const parentEmail = record.get('parentEmail');
                    setNewEmail(parentEmail);
                    setAllowAddViewFriends(record.get('allowAddViewFriends'));
                    setEnableChat(record.get('enableChat'));
                    setAllowMediaSharing(record.get('allowMediaSharing'));
                    setTimeLimit(record.get('timeLimit'));
                    setBackgroundColor(backgroundColor);
                    setParentInfo({
                        email: parentEmail
                    })
                }
            } catch (error) {
                console.error('Failed to load settings from Neo4j:', error);
            } finally {
                await session.close();
            }
        };

        loadSettings();
    }, [sessionToken]);

    /**
     * Handles the change of the parent email. Updates the email in the Neo4j database.
     * Alerts the user on success or failure.
     *
     * @returns {void} No return value.
     */
    const changeEmail = async () => {
        if (!newEmail.trim()) {
            Alert.alert("Error", "Email cannot be empty.");
            return;
        }

        const session = driver.session();
        try {
            const result = await session.run(
                `
                MATCH (u:User {sessionToken: $sessionToken})
                SET u.parentEmail = $newEmail
                RETURN u.parentEmail AS updatedEmail
                `,
                { sessionToken, newEmail }
            );

            if (result.records.length > 0) {
                const updatedEmail = result.records[0].get("updatedEmail");
                setParentInfo({ email: updatedEmail });
                setNewEmail(""); // Clear input
                Alert.alert("Success", "Email updated successfully.");
            } else {
                Alert.alert("Error", "Failed to update email. User not found.");
            }
        } catch (error) {
            console.error("Failed to update email", error);
            Alert.alert("Error", "Could not update email. Please try again.");
        } finally {
            await session.close();
        }
    };

    /**
     * Saves the current parental control settings to the Neo4j database.
     * This includes settings for friend additions, chat enablement, media sharing, and time limits.
     * 
     * @returns {void} No return value.
     */
    const saveControls = async () => {
        const session = driver.session();
        try {
            await session.run(
                `MATCH (u:User {sessionToken: $sessionToken})
                 SET u.allowAddViewFriends = $allowAddViewFriends,
                     u.enableChat = $enableChat,
                     u.allowMediaSharing = $allowMediaSharing,
                     u.timeLimit = $timeLimit,
                     u.backgroundColor = $backgroundColor`,
                { sessionToken, allowAddViewFriends, enableChat, allowMediaSharing, timeLimit, backgroundColor }
            );

            console.log('Parental controls saved');
        } catch (error) {
            console.error('Failed to save settings to Neo4j:', error);
        } finally {
            await session.close();
        }
    };

    /**
     * Navigates the user to the profile page after saving parental control settings.
     * 
     * @returns {void} No return value.
     */
    const goToProfilePage = () => {
        saveControls();
        router.push('/profilePage/profilePage');
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor }]}>
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image
                source={logo_list.find(logo => logo.logo_id === "1")?.logo_image}
                style={styles.logo}
                resizeMode="contain"
                />
            </View>

            {/* Title */}
            <Text style={styles.title}>Parental Controls</Text>

            {/* Email Section */}
            <View style={styles.section}>
                <Text style={styles.currentEmail}>
                    <Text style={styles.bold}>Current Email: </Text>
                    {parentInfo.email}
                </Text>
                <Text style={styles.label}>Change Email:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter new email"
                    value={newEmail}
                    onChangeText={setNewEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: getDarkerShade(backgroundColor) }]}
                    onPress={changeEmail}
                >
                    <Text style={styles.buttonText}>Change Email</Text>
                </TouchableOpacity>
            </View>

            {/* Feature Controls */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Feature Controls</Text>

                {/* Add/View Friends */}
                <View style={styles.controlItem}>
                    <Text style={styles.label}>Allow Add/View Friends</Text>
                    <Switch
                        value={allowAddViewFriends}
                        onValueChange={setAllowAddViewFriends}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={allowAddViewFriends ? '#2196F3' : '#f4f3f4'}
                        accessibilityLabel="Allow Add/View Friends"
                    />
                </View>

                {/* Enable Chat Feature */}
                <View style={styles.controlItem}>
                    <Text style={styles.label}>Enable Chat Feature</Text>
                    <Switch
                        value={enableChat}
                        onValueChange={setEnableChat}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={enableChat ? '#2196F3' : '#f4f3f4'}
                        accessibilityLabel="Enable Chat Feature"
                    />
                </View>

                {/* Allow Media Sharing */}
                <View style={styles.controlItem}>
                    <Text style={styles.label}>Allow Media Sharing</Text>
                    <Switch
                        value={allowMediaSharing}
                        onValueChange={setAllowMediaSharing}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={allowMediaSharing ? '#2196F3' : '#f4f3f4'}
                        accessibilityLabel="Allow Media Sharing"
                    />
                </View>

                {/* Set Time Limits */}
                <View style={styles.controlItem}>
                    <Text style={styles.label}>Set Time Limit (hours per day):</Text>
                    <TextInput
                        style={styles.timeInput}
                        value={timeLimit}
                        onChangeText={setTimeLimit}
                        keyboardType="numeric"
                        maxLength={2}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: getDarkerShade(backgroundColor) }]}
                    onPress={saveControls}
                >
                    <Text style={styles.buttonText}>Save Settings</Text>
                </TouchableOpacity>
            </View>

            {/* Back Button */}
            <TouchableOpacity
                style={[styles.button, styles.backButton, { backgroundColor: getDarkerShade(backgroundColor) }]}
                onPress={goToProfilePage}
            >
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default ParentalControlPanel;