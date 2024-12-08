import React, { useState, useContext } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./indexStyles";
import createNeo4jDriver from './utils/databaseSetUp';
import { AuthContext } from "./AuthContext";
import { avatar_list } from "@/assets/avatars/avatarAssets";
import { Encryption, EncryptionResult } from "@/encryption/Encryption";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [avatarImage, setAvatarImage] = useState(avatar_list[0].avatar_image);
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState(""); // State for error message
  const { setSessionToken } = useContext(AuthContext);
  const [petID, setPetID] = useState("");

  const router = useRouter();

  // Set up the Neo4j driver
  const driver = createNeo4jDriver();

  const handleAuthToggle = () => {
    setIsSignUp(!isSignUp);
    setError(""); // Clear error when switching between Sign Up and Sign In
  };

  const handleAuth = async () => {
    const session = driver.session();

    try {
      if (isSignUp) {
        // Sign Up Logic
        if (!email || !password || !birthday) {
          setError("Email, password, and birthday cannot be blank.");
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("Please enter a valid email address.");
          return;
        }

        // Check if user already exists before attempting to create
        const existingUserResult = await session.run(
          `MATCH (u:User {email: $email}) RETURN u`,
          { email }
        );

        if (existingUserResult.records.length > 0) {
          setError("Email already in use. Please sign in or use a different email.");
          return;
        }

        // generate unique petID
        const generatedPetID = uuid.v4();
        setPetID(generatedPetID);
        const petName = "Benny";

        const birthDate = new Date(birthday);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        const needsParentalControls = age < 13;

        const enableChat = !needsParentalControls;
        const allowAddViewFriends = !needsParentalControls;
        const allowMediaSharing = !needsParentalControls;
        const timeLimit = needsParentalControls ? 2 : null;

        if (needsParentalControls && !parentEmail) {
          setError("Parent's email is required for users under 13.");
          return;
        }

        // Create a new user or ensure the user exists
        const sessionToken = uuid.v4(); 
        const friendCode = uuid.v4();
        setSessionToken(sessionToken);
        const defaultAvatar = avatar_list.find(avatar => avatar.avatar_id === "1")?.avatar_image;

        const result = await session.run(
          `CREATE (u:User {
             email: $email,
             password: $password,
             name: $name,
             streak: 0,
             coins: 100,
             exp: 0,
             backgroundColor: '#99CA9C',
             birthday: $birthday,
             parentEmail: $parentEmail,
             needsParentalControls: $needsParentalControls,
             sessionToken: $sessionToken,
             enableChat: $enableChat, 
             allowMediaSharing: $allowMediaSharing, 
             timeLimit: $timeLimit,
             allowAddViewFriends: $allowAddViewFriends,
             avatarImage: '1',
             friendCode: $friendCode
           })
           WITH u
           CREATE (p:pet {petID: $petID})
           SET p.petName = $petName,
               p.petPNG = $defaultAvatar
           CREATE (u)-[:HAS_PET]->(p)
           RETURN u, p`,
          { 
            email, 
            password, 
            name: "New User", 
            birthday, 
            parentEmail, 
            needsParentalControls, 
            sessionToken, 
            enableChat, 
            allowAddViewFriends, 
            allowMediaSharing, 
            timeLimit, 
            defaultAvatar, 
            friendCode, 
            petID, 
            petName 
          }
        );

        // Always check for actual record creation
        if (result.records.length > 0) {
          // Generate salt and encrypt password
          const salt = Encryption.generateSalt();
          const key = Encryption.generateKeyFromPassword(password, salt);
          
          // Store encrypted credentials
          await AsyncStorage.setItem("email", email);
          await AsyncStorage.setItem("password", JSON.stringify(Encryption.encrypt(password, key)));
          await AsyncStorage.setItem("salt", salt);
          
          console.log("User signed up successfully.");
          router.push("/homePage");
        } else {
          setError("Failed to create user. Please try again.");
        }
      } else {
        // Sign In Logic
        const sessionToken = uuid.v4();
        setSessionToken(sessionToken);

        // First, retrieve the user with the given email
        const userResult = await session.run(
          `MATCH (u:User {email: $email}) RETURN u.password as password`,
          { email }
        );

        if (userResult.records.length === 0) {
          setError("No account found with this email.");
          return;
        }

        // Check the password
        const storedPassword = userResult.records[0].get('password');
        
        if (storedPassword !== password) {
          setError("Invalid password.");
          return;
        }

        // Update session token
        await session.run(
          `MATCH (u:User {email: $email})
           SET u.sessionToken = $sessionToken
           RETURN u`,
          { email, sessionToken }
        );

        // Store credentials for future use
        try {
          // Generate salt and encrypt password
          const salt = Encryption.generateSalt();
          const key = Encryption.generateKeyFromPassword(password, salt);
          
          await AsyncStorage.setItem("email", email);
          await AsyncStorage.setItem("password", JSON.stringify(Encryption.encrypt(password, key)));
          await AsyncStorage.setItem("salt", salt);
        } catch (storageError) {
          console.error("Error storing credentials", storageError);
        }

        console.log("User signed in successfully.");
        router.push("/homePage");
      }
    } catch (error) {
      console.error("Authentication error", error);
      setError("An error occurred. Please try again.");
    } finally {
      await session.close();
      await driver.close();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Sign Up" : "Sign In"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888888"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError(""); // Clear error message when user starts typing
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888888"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError(""); // Clear error message when user starts typing
        }}
      />
      {isSignUp && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Birthday (YYYY-MM-DD)"
            placeholderTextColor="#888888"
            value={birthday}
            onChangeText={(text) => {
              setBirthday(text);
              setError(""); // Clear error message when user starts typing
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Parent's Email (if under 13)"
            placeholderTextColor="#888888"
            keyboardType="email-address"
            value={parentEmail}
            onChangeText={(text) => {
              setParentEmail(text);
              setError(""); // Clear error message when user starts typing
            }}
          />
        </>
      )}

      {/* Display error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity onPress={handleAuth} style={styles.button}>
        <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAuthToggle}>
        <Text style={styles.toggleText}>
          {isSignUp ? "Already have an account? Sign In" : "New user? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}