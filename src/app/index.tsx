// SIGN UP AND LOG IN

import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import styles from "./indexStyles";
import {Encryption, EncryptionResult} from "@/encryption/Encryption";

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
        
        let salt = Encryption.generateSalt()
        let key = Encryption.generateKeyFromPassword(password, salt)
        
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", JSON.stringify(Encryption.encrypt(password, key)));
        await AsyncStorage.setItem("salt", salt);
        
        console.log("User signed up successfully.");
        router.push("/homePage");
      } catch (error) {
        console.error("Failed to save user data", error);
      }
    } else {
      // Sign in logic (validating credentials)
      const storedEmail = await AsyncStorage.getItem("email");
      const storedPassword = await AsyncStorage.getItem("password");
      const storedSalt = await AsyncStorage.getItem("salt");
      
      let key = Encryption.generateKeyFromPassword(password, storedSalt!)
      let encryptedPassword: EncryptionResult = JSON.parse(storedPassword!)
      let decryptedPassword = Encryption.decrypt(key, encryptedPassword.iv, encryptedPassword.ciphertext)

      if (storedEmail === email && decryptedPassword === password) {
        console.log("User signed in successfully.");
        setError(""); // Clear any previous error message
        router.push("/homePage"); // Navigate to home screen
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
