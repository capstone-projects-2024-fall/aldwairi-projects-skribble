import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import neo4j from "neo4j-driver";
import { avatar_list } from '../../assets/avatars/avatarAssets';
import styles from "./styles";
import { logo_list } from '../../assets/logos/logosAssets';
import createNeo4jDriver from '../utils/databaseSetUp';
import { getDarkerShade } from '../utils/colorUtils';
import { AuthContext } from "../AuthContext";

/**
 * ProfilePage component displays and allows the user to update their profile information.
 * It fetches user data from a Neo4j database, including the user's name, email, coins, streak, experience points (EXP), 
 * and friend code (if applicable). It also allows users to change their avatar, name, email, and background color.
 * The component also has functionality for logging out the user, navigating to the parental portal, and navigating back to the home page.
 *
 * @component
 * @example
 * return (
 *   <ProfilePage />
 * )
 * 
 * @returns {React.FC} ProfilePage component that renders the user's profile and offers settings for updates.
 */
const ProfilePage: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [avatarImage, setAvatarImage] = useState(avatar_list[0].avatar_image);
  const { setSessionToken, sessionToken } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    coins: 0,
    streak: 0,
    exp: 0,
    friendCode: "",
  });
  const [newEmail, setNewEmail] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [allowAddViewFriends, setAllowAddViewFriends] = useState(true);
  const router = useRouter();

  // Set up the Neo4j driver
  const driver = createNeo4jDriver();

   /**
   * Loads user data from Neo4j using the session token.
   * This function runs a Cypher query to fetch user details like email, coins, streak, and more.
   */
  useEffect(() => {
    const loadUserData = async () => {
      const session = driver.session();
      try {
        const result = await session.run(
          `MATCH (u:User {sessionToken: $sessionToken})
           RETURN u.email AS email,
                  u.coins AS coins,
                  u.streak AS streak,
                  u.exp AS exp,
                  u.name AS name,
                  u.backgroundColor AS backgroundColor,
                  u.friendCode as friendCode,
                  u.avatarImage AS avatarImage,
                  u.allowAddViewFriends AS allowAddViewFriends`,
          { sessionToken }
        );

        console.log("Query result:", result); // Debugging: check the raw query result

        if (result.records.length > 0) {
          // Directly accessing the fields in the result
          const record = result.records[0];
          // Extract values from the result, handling the INTEGER type if necessary
          const email = record.get("email");
          const coins = Number(record.get("coins"));  
          const streak = record.get("streak")?.low || 0;
          const exp = record.get("exp")?.low || 0;
          const name = record.get("name");
          const backgroundColor = record.get("backgroundColor");
          const friendCode = record.get("friendCode");
          const avatarImage = record.get("avatarImage");
          const allowAddViewFriends = record.get("allowAddViewFriends");

          console.log("User properties:", { email, coins, streak, exp, name, backgroundColor, avatarImage, friendCode, allowAddViewFriends}); // Debugging

          setUserInfo({
            name,
            email,
            coins,
            streak,
            exp,
            friendCode
          });
          setUserName(name || "Unnamed User");
          setBackgroundColor(backgroundColor || "#FFFFFF");
          setAvatarImage(avatarImage || avatar_list[0].avatar_image);
          setSelectedAvatar(avatarImage || avatar_list[0].avatar_image);
          setAllowAddViewFriends(allowAddViewFriends);
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

    if (sessionToken) {
      loadUserData();
    } else {
      Alert.alert("Error", "No session token found.");
    }
  }, [sessionToken]);

  
  /**
   * Handles the avatar selection and updates the user's avatar in the database.
   * @param {string} avatar_id - The ID of the selected avatar.
   */
  const handleAvatarSelect = async (avatar_id: string) => {
    setSelectedAvatar(avatar_id);
    const session = driver.session();
    try {
      await session.run(
        `MATCH (u:User {sessionToken: $sessionToken})
         SET u.avatarImage = $avatarImage
         RETURN u`,
        { sessionToken, avatarImage: avatar_id }
      );
      setAvatarImage(avatar_id);
      Alert.alert("Success", "Avatar updated successfully.");
    } catch (error) {
      console.error("Failed to update avatar", error);
      Alert.alert("Error", "Could not update avatar.");
    } finally {
      await session.close();
    }
  };

  /**
   * Updates the user's name in the database.
   * @returns {void}
   */
  const updateUserName = async () => {
    if (!userName.trim()) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }

    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {sessionToken: $sessionToken})
        SET u.name = $newName
        RETURN u.name AS updatedName
        `,
        { sessionToken, newName: userName }
      );

      if (result.records.length > 0) {
        const updatedName = result.records[0].get("updatedName");
        setUserInfo({ ...userInfo, name: updatedName });
        setUserName(""); // Clear input
        Alert.alert("Success", "Name updated successfully.");
      } else {
        Alert.alert("Error", "Failed to update name. User not found.");
      }
    } catch (error) {
      console.error("Failed to update name", error);
      Alert.alert("Error", "Could not update name. Please try again.");
    } finally {
      await session.close();
    }
  };

  /**
   * Updates the user's email in the database.
   * @returns {void}
   */
  const updateUserEmail = async () => {
    if (!newEmail.trim()) {
      Alert.alert("Error", "Email cannot be empty.");
      return;
    }

    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {sessionToken: $sessionToken})
        SET u.email = $newEmail
        RETURN u.email AS updatedEmail
        `,
        { sessionToken, newEmail }
      );

      if (result.records.length > 0) {
        const updatedEmail = result.records[0].get("updatedEmail");
        setUserInfo({ ...userInfo, email: updatedEmail });
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
   * Updates the background color of the user's profile.
   * @param {string} color - The selected background color.
   * @returns {void}
   */
  const updateBackgroundColor = async (color: string) => {
    const session = driver.session();
    try {
      await session.run(
        `MATCH (u:User {sessionToken: $sessionToken})
         SET u.backgroundColor = $color
         RETURN u`,
        { sessionToken, color }
      );


      setBackgroundColor(color);
    } catch (error) {
      console.error("Failed to update background color", error);
      Alert.alert("Error", "Could not update background color.");
    } finally {
      await session.close();
    }
  };

  /**
 * Navigate to the Parental Portal page.
 * This function is triggered when the user clicks the button to navigate to the Parental Portal.
 * It uses the router to push the '/parentalPortal/parentalPortal' route and transition to that page.
 * 
 * @returns {void} No return value.
 */
  const navigateToParentalPortal = () => {
    router.push('/parentalPortal/parentalPortal');
  };

  /**
 * Navigate to the Home Page.
 * This function is triggered when the user clicks the button to go back to the Home Page.
 * It uses the router to push the '/homePage' route and transition to that page.
 * 
 * @returns {void} No return value.
 */
  const navigateToHomePage = () => {
    router.push('/homePage');
  };

  /**
   * Handles logging out the user by removing the session token from the database.
   */
  const handleLogout = async () => {
    const session = driver.session();
    try {
      await session.run(
        `MATCH (u:User {sessionToken: $token})
         REMOVE u.sessionToken`,
        { token: sessionToken }
      );

      console.log("User logged out.");
      setSessionToken(null); // Clear session token in memory
      router.push("/");
    } catch (error) {
      console.error("Failed to log out user", error);
    } finally {
      await session.close();
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={styles.profileContainer}>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={logo_list.find(logo => logo.logo_id === "1")?.logo_image}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Profile</Text>

        {/* User Info Section */}
        <View style={styles.userInfo}>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Name: </Text>
            {userInfo.name}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Email: </Text>
            {userInfo.email}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Coins: </Text>
            {userInfo.coins}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Streak: </Text>
            {userInfo.streak}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>EXP: </Text>
            {userInfo.exp}
          </Text>
          {allowAddViewFriends && (
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Friend Code: </Text>
              {userInfo.friendCode}
            </Text>
          )}
        </View>

        <View style={styles.centeredSection}>
          <Text style={styles.label}>Update Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new name"
            keyboardType="default"
            value={userName}
            onChangeText={setUserName}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: getDarkerShade(backgroundColor)}]}
            onPress={updateUserName}
          >
            <Text style={styles.buttonText}>Update Name</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.centeredSection}>
          <Text style={{ ...styles.label, marginTop: 20 }}>Update Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new email"
            keyboardType="email-address"
            value={newEmail}
            onChangeText={setNewEmail}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: getDarkerShade(backgroundColor) }]}
            onPress={updateUserEmail}
          >
            <Text style={styles.buttonText}>Update Email</Text>
          </TouchableOpacity>
        </View>

        {/* Update Background Color Section */}
        <View style={styles.section}>
          <Text style={{ ...styles.label, marginTop: 40 }}>Background Color:</Text>
          <View style={styles.colorButtons}>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: "#99CA9C"}]}
              onPress={() => updateBackgroundColor("#99CA9C")}
            >
              <Text style={styles.buttonText}>Green</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: "#9FDDF9" }]}
              onPress={() => updateBackgroundColor("#9FDDF9")}
            >
              <Text style={styles.buttonText}>Blue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: "#FAC1BE" }]}
              onPress={() => updateBackgroundColor("#FAC1BE")}
            >
              <Text style={styles.buttonText}>Pink</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Allow user to select a new avatar */}
        <View style={styles.container}>
          <Text style={styles.avatarTitle}>Select a new avatar</Text>
          <View style={styles.avatarContainer}>
            {avatar_list.map(avatar => (
              <TouchableOpacity key={avatar.avatar_id} onPress={() => handleAvatarSelect(avatar.avatar_id)}>
                <Image
                  source={avatar.avatar_image}
                  style={[
                    styles.avatar,
                    selectedAvatar === avatar.avatar_id && styles.selectedAvatar
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            {/* Button to navigate to parental portal */}
            <TouchableOpacity style={[styles.button, { backgroundColor: getDarkerShade(backgroundColor) }]} onPress={navigateToParentalPortal}>
              <Text style={styles.buttonText}>Go to Parental Portal</Text>
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity style={[styles.button, { backgroundColor: getDarkerShade(backgroundColor) }]} onPress={navigateToHomePage}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity style={[styles.button, { backgroundColor: getDarkerShade(backgroundColor) }]} onPress={handleLogout}>
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;