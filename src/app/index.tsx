// SIGN UP AND LOG IN

import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import styles from "./indexStyles";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const router = useRouter();

  const handleAuthToggle = () => setIsSignUp(!isSignUp);

  const handleAuth = () => {
    console.log(isSignUp ? "Signing up..." : "Signing in...");
    router.push("/homePage"); // Navigate to home screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Sign Up" : "Sign In"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

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