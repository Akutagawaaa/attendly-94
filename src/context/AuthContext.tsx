
import React, { createContext, useContext, useState, useEffect } from "react";

// Mock user types
export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "employee";
  department?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === "admin";

  // Check if the user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock login logic
      const mockUsers: User[] = [
        { id: 1, name: "Alex Johnson", email: "employee@example.com", role: "employee", department: "Engineering" },
        { id: 2, name: "Emma Williams", email: "admin@example.com", role: "admin", department: "HR" },
      ];
      
      const foundUser = mockUsers.find((u) => u.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // Save to local storage
      localStorage.setItem("user", JSON.stringify(foundUser));
      setUser(foundUser);
      
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock Google login
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock Google login response
      const mockGoogleUser: User = {
        id: 3,
        name: "Sarah Chen",
        email: "sarah@example.com",
        role: "employee",
        department: "Design",
        avatarUrl: "https://i.pravatar.cc/150?img=5",
      };
      
      // Save to local storage
      localStorage.setItem("user", JSON.stringify(mockGoogleUser));
      setUser(mockGoogleUser);
      
    } catch (error) {
      console.error("Google login failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    loginWithGoogle,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
