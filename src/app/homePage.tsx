import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Dimensions, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import styles from './homePageStyles';
import { avatar_list } from '../assets/avatars/avatarAssets';
import { clothes_list } from '../assets/clothing/clothingAssets';
import createNeo4jDriver from './utils/databaseSetUp';
import { getDarkerShade } from './utils/colorUtils';
import { AuthContext } from "./AuthContext";

/**
 * HomePage component displays the main interface of the application, including the user's avatar,
 * worn items, and various navigation buttons such as Journal, Profile, Store, Closet, Chat, and Friends.
 * It also dynamically adjusts the UI based on the user's session data, such as avatar, background color, 
 * and enabled features (e.g., chat and friends management).
 * 
 * - Fetches user data from a Neo4j database based on the session token.
 * - Allows dynamic styling based on user preferences and platform.
 * - Conditionally renders buttons and content depending on the user's settings.
 * 
 * @component
 * @example
 * return <HomePage />;
 * 
 * @returns {JSX.Element} The rendered HomePage component
 */
const HomePage: React.FC = () => {
  const router = useRouter();
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [avatarImage, setAvatarImage] = useState(avatar_list[0].avatar_image);
  const [wornItems, setWornItems] = useState<any[]>([]);
  const [allowAddViewFriends, setAllowAddViewFriends] = useState(true);
  const [enableChat, setEnableChat] = useState(true);
  const { sessionToken } = useContext(AuthContext);
  const screenWidth = Dimensions.get('window').width;

  // Set up the Neo4j driver
  const driver = createNeo4jDriver();
  
  /**
   * Loads user data from the database using the session token.
   * This function is executed when the component is mounted (on initial render) and 
   * retrieves user-specific information such as background color, avatar image, 
   * worn items, chat settings, and friend code preferences from the database.
   * 
   * The retrieved data is used to update the component's state, including 
   * background color, avatar, and worn items.
   * 
   * @returns {void} No return value.
   */
  useEffect(() => {
    const loadUserData = async () => {
      const session = driver.session();
      try {
        const result = await session.run(
          `MATCH (u:User {sessionToken: $sessionToken})
           OPTIONAL MATCH (u)-[:WEARS]->(w:Item)
           RETURN 
            u.backgroundColor AS backgroundColor, 
            u.avatarImage AS avatarImage, 
            collect(w.item_id) AS wornItems,
            u.enableChat AS enableChat,
            u.allowAddViewFriends AS allowAddViewFriends`,
          { sessionToken }
        );
        if (result.records.length > 0) {
          // Directly accessing the fields in the result
          const record = result.records[0];
          // Extract values from the result, handling the INTEGER type if necessary
          const backgroundColor = record.get("backgroundColor");
          const avatarImage = record.get("avatarImage");
          const wornItems = record.get("wornItems");
          const enableChat = record.get("enableChat");
          const allowAddViewFriends = record.get("allowAddViewFriends");

          console.log("User properties:", { backgroundColor, avatarImage, wornItems, enableChat, allowAddViewFriends }); // Debugging

          setBackgroundColor(backgroundColor || "#FFFFFF");
          setAvatarImage(avatarImage || avatar_list[0].avatar_image);
          setWornItems(wornItems);
          setAllowAddViewFriends(allowAddViewFriends);
          setEnableChat(enableChat);
        } else {
          Alert.alert("Error", "User not found.");
        }
      } catch (error) {
        console.error("Failed to load user data", error);
        Alert.alert("Error", "Could not fetch user data.");
      } finally {
        await session.close();
      }
    };

    loadUserData();
  }, [sessionToken]);

  /**
   * Navigates to a specified page.
   * This function is used to programmatically navigate to different pages in the app
   * by passing the target page's route as a string.
   * 
   * @param {string} page - The route of the page to navigate to (e.g., "/homePage").
   * @returns {void} No return value.
   */
  const goToPage = (page: string) => {
    router.push(page);
  };

  /**
   * Gets the logo dimensions based on the platform and screen width.
   * This function adjusts the logo's size depending on whether the app is running on 
   * the web or mobile, using screen width to scale the logo size proportionally.
   * 
   * @returns {Object} An object containing the logo's width and height properties.
   * @returns {number} width - The width of the logo.
   * @returns {number} height - The height of the logo.
   */
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
  

  /**
   * Filters the clothes list to return the details of worn items based on the user's 
   * worn items data.
   * This function uses the `wornItems` array, which contains item IDs, to filter 
   * the `clothes_list` and return the details of the items the user is currently wearing.
   * 
   * @returns {Array} An array of objects representing the details of the worn items.
   */
  const wornItemsDetails = clothes_list.filter(item => wornItems.includes(item._id));

  return (
    <View style={[styles.homeContainer, { backgroundColor }]}>
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
          source={avatar_list.find(avatar => avatar.avatar_id === avatarImage)?.avatar_image}
          style={{ width: 250, height: 250 }}
          resizeMode="contain"
        />
        {wornItemsDetails.map(item => (
          <Image
            key={item._id}
            source={item.image}
            style={styles.wornItem}
            resizeMode="contain"
          />
        ))}
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
          <TouchableOpacity style={[styles.buttonStyle, { backgroundColor: getDarkerShade(backgroundColor) }]}
            onPress={() => goToPage('./chatPage/chatPage')}
          >
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
              <Path d="M21 15a2 2 0 0 1 -2 2h-4l-4 4v-4h-4a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2z" />
            </Svg>
          </TouchableOpacity>
        )}

        {/* Friends Button */}
        {allowAddViewFriends && (
          <TouchableOpacity style={[styles.buttonStyle, { backgroundColor: getDarkerShade(backgroundColor) }]}
            onPress={() => goToPage('./friendsPage/friendsPage')}
          >
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
              <Path d="M7 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <Path d="M5 22v-5l-1 -1v-4a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4l-1 1v5" />
              <Path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <Path d="M15 22v-4h-2l2 -6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1l2 6h-2v4" />
            </Svg>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default HomePage;