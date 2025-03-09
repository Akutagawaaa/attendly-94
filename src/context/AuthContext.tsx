
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { User } from "@/models/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  updateOrganizationLogo: (logoUrl: string) => void;
  updateProfile: (profileData: Partial<User>) => void;
  updateAvatar: (avatarUrl: string) => void;
  updateUserStatus: (status: User['status']) => void;
}

interface OTPRecord {
  email: string;
  otp: string;
  expiresAt: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpRecords, setOtpRecords] = useState<OTPRecord[]>([]);
  const isAdmin = user?.role === "admin";

  // Check if the user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Generate a unique employee ID (format: AT-YYYY-XXXX)
  const generateEmployeeId = () => {
    const year = new Date().getFullYear();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `AT-${year}-${randomPart}`;
  };

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock login logic
      const mockUsers: User[] = [
        { 
          id: 1, 
          employeeId: "AT-2024-1001", 
          name: "Alex Johnson", 
          email: "employee@example.com", 
          role: "employee", 
          department: "Engineering",
          designation: "Software Engineer",
          status: "available",
          address: "123 Tech Park, Bangalore"
        },
        { 
          id: 2, 
          employeeId: "AT-2024-1002", 
          name: "Emma Williams", 
          email: "admin@example.com", 
          role: "admin", 
          department: "HR", 
          designation: "HR Manager",
          status: "available",
          address: "456 Corporate Avenue, Mumbai",
          organizationLogo: "https://i.pravatar.cc/150?img=2"
        },
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
        employeeId: "AT-2024-1003",
        name: "Sarah Chen",
        email: "sarah@example.com",
        role: "employee",
        department: "Design",
        designation: "UI/UX Designer",
        status: "available",
        address: "789 Design Studio, Delhi",
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

  // Login with OTP
  const loginWithOTP = async (email: string) => {
    try {
      setLoading(true);
      
      // Generate 6 digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
      
      // Store OTP in local state (in a real app, this would be stored in a database)
      const newOtpRecord: OTPRecord = { email, otp, expiresAt };
      setOtpRecords([...otpRecords.filter(record => record.email !== email), newOtpRecord]);
      
      // Log OTP to console (in a real app, this would send an email)
      console.log(`Your OTP for ${email} is: ${otp}`);
      toast.info(`OTP has been sent to ${email}. Check console for the OTP.`);
      
    } catch (error) {
      console.error("OTP request failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and login
  const verifyOTP = async (email: string, otp: string) => {
    try {
      setLoading(true);
      
      // Find the OTP record
      const otpRecord = otpRecords.find(record => record.email === email);
      
      if (!otpRecord) {
        throw new Error("No OTP was requested for this email");
      }
      
      if (Date.now() > otpRecord.expiresAt) {
        throw new Error("OTP has expired. Please request a new one");
      }
      
      if (otpRecord.otp !== otp) {
        throw new Error("Invalid OTP");
      }
      
      // OTP is valid, proceed with login
      // Mock user lookup
      const mockUsers: User[] = [
        { 
          id: 1, 
          employeeId: "AT-2024-1001", 
          name: "Alex Johnson", 
          email: "employee@example.com", 
          role: "employee", 
          department: "Engineering",
          designation: "Software Engineer",
          status: "available",
          address: "123 Tech Park, Bangalore"
        },
        { 
          id: 2, 
          employeeId: "AT-2024-1002", 
          name: "Emma Williams", 
          email: "admin@example.com", 
          role: "admin", 
          department: "HR", 
          designation: "HR Manager",
          status: "available",
          address: "456 Corporate Avenue, Mumbai",
          organizationLogo: "https://i.pravatar.cc/150?img=2"
        },
      ];
      
      const foundUser = mockUsers.find((u) => u.email === email);
      
      if (!foundUser) {
        // Create a new user if not found
        const newUser: User = {
          id: Math.floor(Math.random() * 1000) + 10,
          employeeId: generateEmployeeId(),
          name: email.split('@')[0],
          email,
          role: "employee",
          department: "New Hire",
          designation: "New Joiner",
          status: "available",
        };
        
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
      } else {
        localStorage.setItem("user", JSON.stringify(foundUser));
        setUser(foundUser);
      }
      
      // Remove the used OTP
      setOtpRecords(otpRecords.filter(record => record.email !== email));
      
    } catch (error) {
      console.error("OTP verification failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Update organization logo (for admin users)
  const updateOrganizationLogo = (logoUrl: string) => {
    if (!user || user.role !== "admin") return;
    
    const updatedUser = { ...user, organizationLogo: logoUrl };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // Update user profile data
  const updateProfile = (profileData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // Update avatar specifically
  const updateAvatar = (avatarUrl: string) => {
    if (!user) return;
    
    const updatedUser = { ...user, avatarUrl };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // Update user status
  const updateUserStatus = (status: User['status']) => {
    if (!user) return;
    
    const updatedUser = { ...user, status };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    loginWithGoogle,
    loginWithOTP,
    verifyOTP,
    logout,
    isAdmin,
    updateOrganizationLogo,
    updateProfile,
    updateAvatar,
    updateUserStatus,
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
