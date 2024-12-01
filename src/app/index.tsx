import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import neo4j from "neo4j-driver";
import { useRouter } from "expo-router";
import styles from "./indexStyles";
import createNeo4jDriver from './utils/databaseSetUp';

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState(""); // State for error message
  const router = useRouter();

  // Set up the Neo4j driver
  const driver = createNeo4jDriver();

  const handleAuthToggle = () => {
    setIsSignUp(!isSignUp);
    setError(""); // Clear error when switching between Sign Up and Sign In
  };

  const handleAuth = async () => {
    const session = driver.session();
  
    if (isSignUp) {
      if (!email || !password || !birthday) {
        setError("Email, password, and birthday cannot be blank.");
        return;
      }

      const birthDate = new Date(birthday);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      const needsParentalControls = age < 13;

      if (needsParentalControls && !parentEmail) {
        setError("Parent's email is required for users under 13.");
        return;
      }
  
      try {
        // Create a new user or ensure the user exists
        const result = await session.run(
          `MERGE (u:User {email: $email})
           ON CREATE SET 
             u.password = $password,
             u.name = $name,
             u.streak = 0,
             u.coins = 0,
             u.exp = 0,
             u.backgroundColor = '#FFFFFF',
             u.birthday = $birthday,
             u.parentEmail = $parentEmail,
             u.needsParentalControls = $needsParentalControls
           RETURN u`,
          { email, password, name: "New User", birthday, parentEmail, needsParentalControls }
        );
  
        if (result.summary.counters.containsUpdates()) {
          console.log("User signed up successfully.");
          router.push("/homePage");
        } else {
          setError("User already exists.");
        }
      } catch (error) {
        console.error("Failed to sign up user", error);
        setError("An error occurred while signing up. Please try again.");
      } finally {
        await session.close();
        await driver.close();
      }
    } else {
      try {
        // Validate existing user credentials
        const result = await session.run(
          `MATCH (u:User {email: $email, password: $password})
           RETURN u`,
          { email, password }
        );
  
        if (result.records.length > 0) {
          console.log("User signed in successfully.");
          router.push("/homePage");
        } else {
          setError("Invalid email or password.");
        }
      } catch (error) {
        console.error("Failed to sign in user", error);
        setError("An error occurred while signing in. Please try again.");
      } finally {
        await session.close();
        await driver.close();
      }
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