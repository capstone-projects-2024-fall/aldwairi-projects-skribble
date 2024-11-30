import React, { useState, useEffect } from "react";
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

const ProfilePage: React.FC = () => {
  const [userName, setUserName] = useState("Loading...");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [avatarImage, setAvatarImage] = useState(avatar_list[0].avatar_image); 
  const [userInfo, setUserInfo] = useState({
    email: "",
    coins: 0,
    streak: 0,
    exp: 0,
  });
  const [newEmail, setNewEmail] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const router = useRouter();

  const handleAvatarSelect = async (avatar_id: string) => {
    setSelectedAvatar(avatar_id);
    const session = driver.session();
    try {
      await session.run(
        `MATCH (u:User {email: $email})
         SET u.avatarImage = $avatarImage
         RETURN u`,
        { email: userInfo.email, avatarImage: avatar_id }
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

  const navigateToParentalPortal = () => {
    router.push('/parentalPortal/parentalPortal');
  };

  const navigateToHomePage = () => {
    router.push('/homePage');
  };

  // Set up the Neo4j driver
  const driver = createNeo4jDriver();

  // Load user data from Neo4j
  useEffect(() => {
    const loadUserData = async () => {
      const session = driver.session();
      try {
        const result = await session.run(
          `MATCH (u:User {email: $email})
           RETURN u.email AS email, u.coins AS coins, u.streak AS streak, u.exp AS exp, u.name AS name, u.backgroundColor AS backgroundColor, u.avatarImage AS avatarImage`,
          { email: "<current_user_email>" } // Replace with the logged-in user's email
        );

        if (result.records.length > 0) {
          const user = result.records[0].get("u").properties;
          setUserInfo({
            email: user.email,
            coins: user.coins,
            streak: user.streak,
            exp: user.exp,
          });
          setUserName(user.name || "Unnamed User");
          setBackgroundColor(user.backgroundColor || "#FFFFFF");
          setAvatarImage(user.avatarImage || avatarImage);
          setSelectedAvatar(user.avatarImage || avatar_list[0].avatar_image);
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
  }, []);

  // Update user email in Neo4j
  const updateUserEmail = async () => {
    if (!newEmail.trim()) {
      Alert.alert("Error", "Email cannot be empty.");
      return;
    }
  
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {email: $email})
        SET u.email = $newEmail
        RETURN u.email AS updatedEmail
        `,
        { email: userInfo.email, newEmail } // Ensure email matches your database record
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

  // Update background color in Neo4j
  const updateBackgroundColor = async (color: string) => {
    const session = driver.session();
    try {
      await session.run(
        `MATCH (u:User {email: $email})
         SET u.backgroundColor = $color
         RETURN u`,
        { email: userInfo.email, color }
      );

      setBackgroundColor(color);
    } catch (error) {
      console.error("Failed to update background color", error);
      Alert.alert("Error", "Could not update background color.");
    } finally {
      await session.close();
    }
  };

  const handleLogout = () => {
    router.push("/");
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
            {userName}
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
        </View>

        <View style={styles.centeredSection}>
          <Text style={styles.label}>Update Email:</Text>
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
          <Text style={styles.label}>Background Color:</Text>
          <View style={styles.colorButtons}>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: "#99CA9C" }]}
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

        {/* Allow user to select a new avatar: show all avatars and allow user to select one */}
        <View style={styles.container}>
            <Text style={styles.title}>Select a new avatar</Text>
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
        {/* Button to navigate to parental portal  */}
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