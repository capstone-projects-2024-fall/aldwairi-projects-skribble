// SIGN UP AND LOG IN

import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import neo4j from "neo4j-driver";
import { useRouter } from "expo-router";
import styles from "./indexStyles";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState(""); // State for error message
  const router = useRouter();

  // Set up the Neo4j driver
  const driver = neo4j.driver(
    "neo4j+s://24f2d4b6.databases.neo4j.io", // Replace with your Neo4j instance address
    neo4j.auth.basic("neo4j", "SXrtyxnQgr5WBO8yNwulKKI9B1ulfsiLa8SKvlJk5Hc") // Replace with your credentials
  );

  const handleAuthToggle = () => {
    setIsSignUp(!isSignUp);
    setError(""); // Clear error when switching between Sign Up and Sign In
  };

  const handleAuth = async () => {
    const session = driver.session();
    try {
      if (!email || !password) {
        setError("Email and password cannot be blank.");
        return;
      }

      if (isSignUp) {
        // Check if the email is already registered
        const checkQuery = `
          MATCH (u:User {email: $email})
          RETURN u
        `;
        const existingUser = await session.run(checkQuery, { email });

        if (existingUser.records.length > 0) {
          setError("Email is already registered.");
          return;
        }

        // Sign up logic: Create a new user
        const signUpQuery = `
          CREATE (u:User {email: $email, password: $password})
        `;
        await session.run(signUpQuery, { email, password });
        console.log("User signed up successfully.");
        router.push("/homePage");
      } else {
        // Sign in logic: Validate credentials
        const signInQuery = `
          MATCH (u:User {email: $email, password: $password})
          RETURN u
        `;
        const result = await session.run(signInQuery, { email, password });

        if (result.records.length > 0) {
          console.log("User signed in successfully.");
          router.push("/homePage");
        } else {
          setError("Invalid email or password. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error during authentication", error);
      setError("Something went wrong. Please try again.");
    } finally {
      await session.close();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Sign Up" : "Sign In"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
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
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError(""); // Clear error message when user starts typing
        }}
      />

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
