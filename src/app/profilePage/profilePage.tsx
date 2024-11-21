import React, { useState, useEffect } from 'react';
import styles from './styles';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Path } from 'react-native-svg';
import { logOut } from '../logOut';

const ProfilePage: React.FC = () => {
  const [avatarName, setAvatarName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [userName, setUserName] = useState('John Doe');
  const [userInfo, setUserInfo] = useState({
    email: '',
    coins: 120,
    streak: 15,
    exp: 950,
  });
  const router = useRouter();

  // Load user data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedColor, savedEmail, savedName] = await Promise.all([
          AsyncStorage.getItem('backgroundColor'),
          AsyncStorage.getItem('email'),
          AsyncStorage.getItem('userName'),
        ]);

        if (savedColor) {
          setBackgroundColor(savedColor);
        }
        if (savedEmail) {
          setUserInfo(prevState => ({ ...prevState, email: savedEmail }));
        }
        if (savedName) {
          setUserName(savedName);
        }
      } catch (error) {
        console.error('Failed to load data from AsyncStorage', error);
        Alert.alert('Error', 'Failed to load user data');
      }
    };
    loadData();
  }, []);

  const updateAvatarName = async () => {
    if (avatarName.trim() === '') {
      Alert.alert('Error', 'Avatar name cannot be empty');
      return;
    }

    try {
      await AsyncStorage.setItem('userName', avatarName);
      setUserName(avatarName);
      setAvatarName(''); // Clear input field
      Alert.alert('Success', 'Avatar name updated successfully');
    } catch (error) {
      console.error('Failed to save avatar name', error);
      Alert.alert('Error', 'Failed to update avatar name');
    }
  };

  const changeBackgroundColor = async (color: string) => {
    try {
      await AsyncStorage.setItem('backgroundColor', color);
      setBackgroundColor(color);
    } catch (error) {
      console.error('Failed to save background color', error);
      Alert.alert('Error', 'Failed to update background color');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'email',
                'password',
                'userName',
                'backgroundColor',
              ]);
              router.push('/');
            } catch (error) {
              console.error('Failed to remove user data', error);
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  // Rest of the component remains the same...
  const HomeIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" stroke="white" strokeWidth={2} fill="none">
      <Path d="M5 12l-2 0l9 -9l9 9l-2 0" />
      <Path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
      <Path d="M10 12h4v4h-4z" />
    </Svg>
  );

  const LogoutIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" stroke="white" strokeWidth={2} fill="none">
      <Path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" />
      <Path d="M15 12h-12l3 -3" />
      <Path d="M6 15l-3 -3" />
    </Svg>
  );

  const DeleteIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" stroke="white" strokeWidth={2} fill="none">
      <Path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <Path d="M9 12l6 0" />
    </Svg>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={styles.profileContainer}>
        <Text style={styles.title}>User Profile</Text>

        {/* User Info Section */}
        <View style={styles.userInfo}>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Name: </Text>
            {userName}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Email: </Text>
            {userInfo.email}
          </Text>
          
          <View style={styles.statsContainer}>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Coins: </Text>
              {userInfo.coins}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Streak: </Text>
              {userInfo.streak}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>EXP: </Text>
              {userInfo.exp}
            </Text>
          </View>
        </View>

        {/* Avatar Edit Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Edit Avatar Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new avatar name"
            value={avatarName}
            onChangeText={setAvatarName}
          />
          <TouchableOpacity style={styles.button} onPress={updateAvatarName}>
            <Text style={styles.buttonText}>Update Avatar Name</Text>
          </TouchableOpacity>
        </View>

        {/* Background Color Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Choose Background Color:</Text>
          <View style={styles.colorButtons}>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: '#99CA9C' }]}
              onPress={() => changeBackgroundColor('#99CA9C')}>
              <Text style={styles.buttonText}>Green</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: '#9FDDF9' }]}
              onPress={() => changeBackgroundColor('#9FDDF9')}>
              <Text style={styles.buttonText}>Blue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: '#FAC1BE' }]}
              onPress={() => changeBackgroundColor('#FAC1BE')}>
              <Text style={styles.buttonText}>Pink</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Buttons */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('../parentalPortal/parentalPortal')}>
          <Text style={styles.buttonText}>Parental Controls</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('../homePage')}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Back</Text>
            <HomeIcon />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={logOut}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Log Out</Text>
            <LogoutIcon />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleDelete}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Delete</Text>
            <DeleteIcon />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;