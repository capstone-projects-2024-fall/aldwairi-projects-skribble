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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logo_list } from '../../assets/logos/logosAssets';

const ParentalControlPanel: React.FC = () => {
    const router = useRouter();

    // Initial state setup with default values
    const [email, setEmail] = useState('parent@example.com');
    const [newEmail, setNewEmail] = useState('');
    const [allowAddViewFriends, setAllowAddViewFriends] = useState(true);
    const [enableChat, setEnableChat] = useState(true);
    const [allowMediaSharing, setAllowMediaSharing] = useState(true);
    const [timeLimit, setTimeLimit] = useState('2'); // Changed to string for TextInput
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

    // Use Effect to load saved settings from AsyncStorage
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('email');
                const savedAllowAddViewFriends = await AsyncStorage.getItem('allowAddViewFriends');
                const savedEnableChat = await AsyncStorage.getItem('enableChat');
                const savedAllowMediaSharing = await AsyncStorage.getItem('allowMediaSharing');
                const savedTimeLimit = await AsyncStorage.getItem('timeLimit');
                const savedBackgroundColor = await AsyncStorage.getItem('backgroundColor');

                if (savedEmail) setEmail(savedEmail);
                if (savedAllowAddViewFriends !== null) setAllowAddViewFriends(JSON.parse(savedAllowAddViewFriends));
                if (savedEnableChat !== null) setEnableChat(JSON.parse(savedEnableChat));
                if (savedAllowMediaSharing !== null) setAllowMediaSharing(JSON.parse(savedAllowMediaSharing));
                if (savedTimeLimit) setTimeLimit(savedTimeLimit);
                if (savedBackgroundColor) setBackgroundColor(savedBackgroundColor);
            } catch (error) {
                console.error('Failed to load settings from AsyncStorage:', error);
            }
        };

        loadSettings();
    }, []);

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
        try {
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('allowAddViewFriends', JSON.stringify(allowAddViewFriends));
            await AsyncStorage.setItem('enableChat', JSON.stringify(enableChat));
            await AsyncStorage.setItem('allowMediaSharing', JSON.stringify(allowMediaSharing));
            await AsyncStorage.setItem('timeLimit', timeLimit);
            await AsyncStorage.setItem('backgroundColor', backgroundColor);

            console.log('Parental controls saved');
        } catch (error) {
            console.error('Failed to save settings to AsyncStorage:', error);
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