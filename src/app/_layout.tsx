import React from "react";
import { AuthProvider } from "./AuthContext";
import { Stack } from "expo-router";

/**
 * RootLayout component serves as the main entry point for the app, providing authentication context 
 * and setting up the app's navigation stack. It wraps the entire application in the `AuthProvider` 
 * to make authentication state accessible throughout the app. It also configures the navigation stack 
 * without displaying the default header.
 * 
 * - The `AuthProvider` provides authentication context to all components within the app.
 * - The `Stack` component is used to manage the navigation between pages/screens, with the header hidden.
 * 
 * @export
 * @returns {JSX.Element} The rendered RootLayout component with authentication context and navigation setup.
 */
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
