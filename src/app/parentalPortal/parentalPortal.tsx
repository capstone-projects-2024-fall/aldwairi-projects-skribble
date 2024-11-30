import React, { useState, useEffect } from 'react';
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

const ParentalControlPanel: React.FC = () => {
    const router = useRouter();

    // Set up the Neo4j driver
    const driver = neo4j.driver(
        "neo4j+s://24f2d4b6.databases.neo4j.io", // Replace with your Neo4j instance address
        neo4j.auth.basic("neo4j", "SXrtyxnQgr5WBO8yNwulKKI9B1ulfsiLa8SKvlJk5Hc") // Replace with your credentials
    );

    // Initial state setup with default values
    const [email, setEmail] = useState('parent@example.com');
    const [newEmail, setNewEmail] = useState('');
    const [allowAddViewFriends, setAllowAddViewFriends] = useState(true);
    const [enableChat, setEnableChat] = useState(true);
    const [allowMediaSharing, setAllowMediaSharing] = useState(true);
    const [timeLimit, setTimeLimit] = useState('2'); // Changed to string for TextInput
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

    // Use Effect to load saved settings from Neo4j
    useEffect(() => {
        const loadSettings = async () => {
            const session = driver.session();
            try {
                const result = await session.run(
                    `MATCH (u:User {parentEmail: $email})
                     RETURN u.allowAddViewFriends AS allowAddViewFriends, 
                            u.enableChat AS enableChat, 
                            u.allowMediaSharing AS allowMediaSharing, 
                            u.timeLimit AS timeLimit, 
                            u.backgroundColor AS backgroundColor`,
                    { email }
                );

                if (result.records.length > 0) {
                    const record = result.records[0];
                    setAllowAddViewFriends(record.get('allowAddViewFriends'));
                    setEnableChat(record.get('enableChat'));
                    setAllowMediaSharing(record.get('allowMediaSharing'));
                    setTimeLimit(record.get('timeLimit'));
                    setBackgroundColor(record.get('backgroundColor'));
                }
            } catch (error) {
                console.error('Failed to load settings from Neo4j:', error);
            } finally {
                await session.close();
            }
        };

        loadSettings();
    }, [email]);

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
                `MERGE (u:User {parentEmail: $email})
                 SET u.allowAddViewFriends = $allowAddViewFriends, 
                     u.enableChat = $enableChat, 
                     u.allowMediaSharing = $allowMediaSharing, 
                     u.timeLimit = $timeLimit, 
                     u.backgroundColor = $backgroundColor`,
                { email, allowAddViewFriends, enableChat, allowMediaSharing, timeLimit, backgroundColor }
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
            <Text style={styles.title}>Parental Control Panel</Text>

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
                    style={styles.button}
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
                    style={styles.button}
                    onPress={saveControls}
                >
                    <Text style={styles.buttonText}>Save Settings</Text>
                </TouchableOpacity>
            </View>

            {/* Back Button */}
            <TouchableOpacity 
                style={[styles.button, styles.backButton]}
                onPress={goToProfilePage}
            >
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default ParentalControlPanel;