import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { User } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            const supabaseUser: User = {
              id: parseInt(profile.id, 10) || Math.floor(Math.random() * 1000) + 10,
              employeeId: profile.id.substring(0, 8),
              name: profile.name,
              email: profile.email,
              role: profile.role || "employee",
              department: profile.department || "General",
              status: "available"
            };
            setUser(supabaseUser);
          } else {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          }
        } else {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            const supabaseUser: User = {
              id: parseInt(data.user.id, 10) || Math.floor(Math.random() * 1000) + 10,
              employeeId: profile.id.substring(0, 8),
              name: profile.name,
              email: profile.email,
              role: profile.role || "employee",
              department: profile.department || "General",
              status: "available"
            };
            setUser(supabaseUser);
            localStorage.setItem("user", JSON.stringify(supabaseUser));
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem("user");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const generateEmployeeId = () => {
    const year = new Date().getFullYear();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `AT-${year}-${randomPart}`;
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.warn("Supabase auth failed, falling back to mock login:", error.message);
        
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
        
        localStorage.setItem("user", JSON.stringify(foundUser));
        setUser(foundUser);
      } else if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profile) {
          const supabaseUser: User = {
            id: parseInt(data.user.id, 10) || Math.floor(Math.random() * 1000) + 10,
            employeeId: profile.id.substring(0, 8),
            name: profile.name,
            email: profile.email,
            role: profile.role || "employee",
            department: profile.department || "General",
            status: "available"
          };
          
          setUser(supabaseUser);
          localStorage.setItem("user", JSON.stringify(supabaseUser));
        }
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error("Google auth failed:", error.message);
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
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
        
        localStorage.setItem("user", JSON.stringify(mockGoogleUser));
        setUser(mockGoogleUser);
      }
    } catch (error) {
      console.error("Google login failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithOTP = async (email: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error("OTP request failed:", error.message);
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000;
        
        const newOtpRecord: OTPRecord = { email, otp, expiresAt };
        setOtpRecords([...otpRecords.filter(record => record.email !== email), newOtpRecord]);
        
        console.log(`Your OTP for ${email} is: ${otp}`);
        toast.info(`OTP has been sent to ${email}. Check console for the OTP.`);
      } else {
        toast.success("A magic link has been sent to your email address");
      }
      
    } catch (error) {
      console.error("OTP request failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setLoading(true);
      
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
      
      setOtpRecords(otpRecords.filter(record => record.email !== email));
      
    } catch (error) {
      console.error("OTP verification failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out from Supabase:", error);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const updateOrganizationLogo = (logoUrl: string) => {
    if (!user || user.role !== "admin") return;
    
    const updatedUser = { ...user, organizationLogo: logoUrl };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const updateProfile = (profileData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const updateAvatar = (avatarUrl: string) => {
    if (!user) return;
    
    const updatedUser = { ...user, avatarUrl };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

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
