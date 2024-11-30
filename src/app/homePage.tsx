import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import styles from './homePageStyles';
import { avatar_list } from '../assets/avatars/avatarAssets';
import createNeo4jDriver from './utils/databaseSetUp';
import { getDarkerShade } from './utils/colorUtils'; 

const HomePage: React.FC = () => {
  const router = useRouter();
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [allowAddViewFriends, setAllowAddViewFriends] = useState(false);
  const [enableChat, setEnableChat] = useState(false);
  const parentEmail = 'parent@example.com'; // Replace with the actual parent email

  const screenWidth = Dimensions.get('window').width;

  // Set up the Neo4j driver
  const driver = createNeo4jDriver();

  useEffect(() => {
    const loadSettings = async () => {
      const session = driver.session();
      try {
        const result = await session.run(
          `MATCH (u:User {parentEmail: $parentEmail})
           RETURN u.allowAddViewFriends AS allowAddViewFriends, 
                  u.enableChat AS enableChat,
                  u.backgroundColor AS backgroundColor`,
          { parentEmail }
        );

        if (result.records.length > 0) {
          const record = result.records[0];
          setAllowAddViewFriends(record.get('allowAddViewFriends'));
          setEnableChat(record.get('enableChat'));
          setBackgroundColor(record.get('backgroundColor'));
        }
      } catch (error) {
        console.error('Failed to load settings from Neo4j:', error);
      } finally {
        await session.close();
      }
    };

    loadSettings();
  }, [parentEmail]);

  const goToPage = (page: string) => {
    router.push(page);
  };

  const getLogoDimensions = () => {
    if (Platform.OS === 'web') {
        return {
            width: Math.min(screenWidth * 0.4, 500),
            height: Math.min(screenWidth * 0.12, 150),
        };
    } else {
        return {
            width: Math.min(screenWidth * 0.7, 300),
            height: Math.min(screenWidth * 0.21, 90),
        };
    }
};

const logoDimensions = getLogoDimensions();

  return (
    <View style={styles.homeContainer}>
      <View style={[
        styles.logoContainer, 
        Platform.OS === 'web' ? styles.logoContainerWeb : styles.logoContainerMobile
      ]}>
        <Image
          source={require('../assets/images/GreenPinkLogo.png')}
          style={[styles.logo, { width: logoDimensions.width, height: logoDimensions.height }]}
          resizeMode="contain"
        />
      </View>

      <View style={[styles.avatar, { marginTop: 100 }]}>
        <Image
          source={avatar_list.find(avatar => avatar.avatar_id === "1")?.avatar_image}
          style={{ width: 250, height: 250 }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.buttonStyle, { backgroundColor: getDarkerShade(backgroundColor) }]}
        onPress={() => goToPage('./journalPage/journalPage')}
      >
        <Text style={styles.buttonText}>Journal</Text>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="24"
          height="24"
          strokeWidth="2"
          style={styles.icon}
        >
          <Path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18" />
          <Path d="M13 8l2 0" />
          <Path d="M13 12l2 0" />
        </Svg>
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity
        style={[styles.buttonStyle, { backgroundColor: getDarkerShade(backgroundColor) }]}
        onPress={() => goToPage('./profilePage/profilePage')}
      >
        <Text style={styles.buttonText}>Profile</Text>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="24"
          height="24"
          strokeWidth="2"
          style={styles.icon}
        >
          <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
          <Path d="M4 19c0-2.21 3.58-4 8-4s8 1.79 8 4" />
        </Svg>
      </TouchableOpacity>

      {/* Store Button */}
      <TouchableOpacity
        style={[styles.buttonStyle, { backgroundColor: getDarkerShade(backgroundColor) }]}
        onPress={() => goToPage('./storePage/storePage')}
      >
        <Text style={styles.buttonText}>Store</Text>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="24"
          height="24"
          strokeWidth="2"
          style={styles.icon}
        >
          <Path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <Path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <Path d="M17 17h-11v-14h-2" />
          <Path d="M6 5l14 1l-1 7h-13" />
        </Svg>
      </TouchableOpacity>

      {/* Closet Button */}
      <TouchableOpacity
        style={[styles.buttonStyle, { backgroundColor: getDarkerShade(backgroundColor) }]}
        onPress={() => goToPage('./closetPage/closetPage')}
      >
        <Text style={styles.buttonText}>Closet</Text>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="24"
          height="24"
          strokeWidth="2"
          style={styles.icon}
        >
          <Path d="M14 6a2 2 0 1 0 -4 0c0 1.667 .67 3 2 4h-.008l7.971 4.428a2 2 0 0 1 1.029 1.749v.823a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-.823a2 2 0 0 1 1.029 -1.749l7.971 -4.428" />
        </Svg>
      </TouchableOpacity>

      {/* Chat Button */}
      {enableChat && (
        <TouchableOpacity style={[styles.buttonStyle, { backgroundColor: getDarkerShade(backgroundColor) }]}>
          <Text style={styles.buttonText}>Chat</Text>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
            strokeWidth="2"
            style={styles.icon}
          >
            <Path d="M21 15a2 2 0 0 1 -2 2h-4l-4 4v-4h-4a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2z"/>
          </Svg>
        </TouchableOpacity>
      )}

      {/* Friends Button */}
      {allowAddViewFriends && (
        <TouchableOpacity style={[styles.buttonStyle, { backgroundColor: getDarkerShade(backgroundColor) }]}>
          <Text style={styles.buttonText}>Friends</Text>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
            strokeWidth="2"
            style={styles.icon}
          >
            <Path d="M7 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
            <Path d="M5 22v-5l-1 -1v-4a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4l-1 1v5"/>
            <Path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
            <Path d="M15 22v-4h-2l2 -6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1l2 6h-2v4"/>
          </Svg>
        </TouchableOpacity>
      )}
      </View>
    </View>
  );
};

export default HomePage;