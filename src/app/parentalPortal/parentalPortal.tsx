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
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import neo4j from 'neo4j-driver';
import { logo_list } from '../../assets/logos/logosAssets';
import createNeo4jDriver from '../utils/databaseSetUp';
import { getDarkerShade } from '../utils/colorUtils';
import { AuthContext } from "../AuthContext"; 

const ParentalControlPanel: React.FC = () => {
    const router = useRouter();

    // Set up the Neo4j driver
    const driver = createNeo4jDriver();

    // Initial state setup with default values
    const [email, setEmail] = useState('parent@example.com');
    const [newEmail, setNewEmail] = useState('');
    const [allowAddViewFriends, setAllowAddViewFriends] = useState(false);
    const [enableChat, setEnableChat] = useState(false);
    const [allowMediaSharing, setAllowMediaSharing] = useState(false);
    const [timeLimit, setTimeLimit] = useState('2'); // Changed to string for TextInput
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const { setSessionToken, sessionToken } = useContext(AuthContext);

    // Use Effect to load saved settings from Neo4j
    useEffect(() => {
        const loadSettings = async () => {
            const session = driver.session();
            try {
                const result = await session.run(
                    `MATCH (u:User {sessionToken: $sessionToken})
                     RETURN u.allowAddViewFriends AS allowAddViewFriends, 
                            u.enableChat AS enableChat, 
                            u.allowMediaSharing AS allowMediaSharing, 
                            u.timeLimit AS timeLimit, 
                            u.backgroundColor AS backgroundColor`,
                    { sessionToken }
                );

                if (result.records.length > 0) {
                    const record = result.records[0];
                    const backgroundColor = record.get("backgroundColor");
                    
                    setAllowAddViewFriends(record.get('allowAddViewFriends'));
                    setEnableChat(record.get('enableChat'));
                    setAllowMediaSharing(record.get('allowMediaSharing'));
                    setTimeLimit(record.get('timeLimit'));
                    setBackgroundColor(backgroundColor);
                }
            } catch (error) {
                console.error('Failed to load settings from Neo4j:', error);
            } finally {
                await session.close();
            }
        };

        loadSettings();
    }, [sessionToken]);

    // Change the email address
    const changeEmail = () => {
        if (newEmail) {
            setEmail(newEmail);
            setNewEmail('');
            console.log(`Email changed to: ${newEmail}`);
        }
    };

    // Save all settings
    const saveControls = async () => {
        const session = driver.session();
        try {
            await session.run(
                `MERGE (u:User {sessionToken: $sessionToken})
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
                    {email}
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