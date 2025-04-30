import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initially, set loading to true
  

  useEffect(() => {
    const storedUser = localStorage.getItem("user-info");
    if (storedUser && storedUser !== "null") {
      setUser(JSON.parse(storedUser)); // Parse and set the user data from localStorage if available
    }
    setLoading(false); // After the check, set loading to false
  }, []);

  const login = (userData: any) => {
    localStorage.setItem("user-info", JSON.stringify(userData)); // Store user data in localStorage
    setUser(userData); // Set the user state

  };

  const logout = () => {
    localStorage.removeItem("user-info"); // Remove user data from localStorage
    setUser(null); // Clear the user state
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider"); // Error handling if the context is used outside the provider
  }
  return context;
};
