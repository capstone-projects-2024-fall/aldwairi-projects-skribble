import React, { createContext, useState } from "react";

/**
 * AuthContext is a context that provides authentication-related state
 * (such as the session token) and functions (like setting the session token)
 * to the components within the application.
 *
 * @type {React.Context<{ sessionToken: string | null, setSessionToken: React.Dispatch<React.SetStateAction<string | null>> }>}
 */
export const AuthContext = createContext();

/**
 * AuthProvider component is a wrapper that provides the authentication context
 * to the children components. It manages the session token state, allowing
 * components to access and update it.
 * 
 * - Provides the `sessionToken` and `setSessionToken` via context.
 * - Any component wrapped in this provider can access or modify the authentication state.
 * 
 * @param {{ children: React.ReactNode }} param0 - The child components to be wrapped.
 * @param {React.ReactNode} param0.children - The child elements that will have access to the authentication context.
 * @returns {JSX.Element} The rendered AuthProvider component with the context provider.
 */
export const AuthProvider = ({ children }) => {
  const [sessionToken, setSessionToken] = useState(null);

  return (
    <AuthContext.Provider value={{ sessionToken, setSessionToken }}>
      {children}
    </AuthContext.Provider>
  );
};
