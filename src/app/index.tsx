// SIGN UP AND LOG IN

import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import styles from "./indexStyles";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState(""); // State for error message
  const router = useRouter();

  const handleAuthToggle = () => {
    setIsSignUp(!isSignUp);
    setError(""); // Clear error when switching between Sign Up and Sign In
  };

  const handleAuth = async () => {
    if (isSignUp) {
      if (!email || !password) {
        setError("Email and password cannot be blank.");
        return; // Stop further execution if fields are empty
      }
      // Sign up logic (saving credentials)
      try {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", password);
        console.log("User signed up successfully.");
        router.push("/homePage/homePage");
      } catch (error) {
        console.error("Failed to save user data", error);
      }
    } else {
      // Sign in logic (validating credentials)
      const storedEmail = await AsyncStorage.getItem("email");
      const storedPassword = await AsyncStorage.getItem("password");

      if (storedEmail === email && storedPassword === password) {
        console.log("User signed in successfully.");
        setError(""); // Clear any previous error message
        router.push("/homePage/homePage"); // Navigate to home screen
      } else {
        console.log("Invalid credentials.");
        setError("Invalid email or password. Please try again.");
      }
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
