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

const ProfilePage: React.FC = () => {
  const [userName, setUserName] = useState("Loading...");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [avatarImage, setAvatarImage] = useState(""); // URL or name of the avatar image
  const [userInfo, setUserInfo] = useState({
    email: "",
    coins: 0,
    streak: 0,
    exp: 0,
  });
  const [newName, setNewName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const router = useRouter();

  const handleAvatarSelect = (avatar_id: string) => {
    setSelectedAvatar(avatar_id);
  };

  const navigateToParentalPortal = () => {
    router.push('/parentalPortal/parentalPortal');
  };

  const navigateToHomePage = () => {
    router.push('/homePage');
  };

  // Initialize Neo4j driver
  const driver = neo4j.driver(
    "neo4j+s://24f2d4b6.databases.neo4j.io", // Replace with your Neo4j URI
    neo4j.auth.basic("neo4j", "SXrtyxnQgr5WBO8yNwulKKI9B1ulfsiLa8SKvlJk5Hc") // Replace with your credentials
  );

  // Load user data from Neo4j
  useEffect(() => {
    const loadUserData = async () => {
      const session = driver.session();
      try {
        const result = await session.run(
          `MATCH (u:User {email: $email})
           RETURN u`,
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
          setAvatarImage(user.avatarImage || ""); // Default avatar if not set
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

  // Update user name in Neo4j
  const updateUserName = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }
  
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {email: $email})
        SET u.name = $name
        RETURN u.name AS updatedName
        `,
        { email: userInfo.email, name: newName } // Ensure email matches your database record
      );
  
      if (result.records.length > 0) {
        const updatedName = result.records[0].get("updatedName");
        setUserName(updatedName);
        setNewName(""); // Clear input
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

        {/* Update Name Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Update Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new name"
            value={newName}
            onChangeText={setNewName}
          />
          <TouchableOpacity style={styles.button} onPress={updateUserName}>
            <Text style={styles.buttonText}>Update Name</Text>
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

            
        {/* Button to navigate to parental portal  */}
        <TouchableOpacity style={styles.button} onPress={navigateToParentalPortal}>
                <Text style={styles.buttonText}>Go to Parental Portal</Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity style={[styles.button]} onPress={navigateToHomePage}>
                <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
};

export default ProfilePage;