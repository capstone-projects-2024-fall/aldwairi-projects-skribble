import React from "react";
import { AuthProvider } from "./AuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false, // Hide the header if you don't need it
        }}
      />
    </AuthProvider>
  );
}
