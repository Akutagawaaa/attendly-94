
import { User } from "../models/types";
import { db } from "../config/db";
import { supabase } from "../integrations/supabase/client";
import { registrationService } from "./registrationService";

// Generate a unique employee ID
const generateEmployeeId = () => {
  return `EMP-${Date.now().toString().slice(-6)}`;
};

export const userService = {
  async login(email: string, password: string): Promise<User | null> {
    return this.loginUser(email, password);
  },
  
  async loginUser(email: string, password: string): Promise<User | null> {
    try {
      // In a real implementation, this would verify credentials against the database
      // For demonstration, we'll check localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password_hash === password);
      
      if (!user) {
        return null;
      }
      
      const loggedInUser: User = {
        id: user.id,
        employeeId: user.employee_id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation || '',
        status: user.status || 'offline',
        avatarUrl: user.avatar_url || ''
      };
      
      // Store current user in localStorage for session management
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      
      return loggedInUser;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  },
  
  async getUser(): Promise<User | null> {
    return this.getCurrentUser();
  },
  
  async getEmployeeById(id: number): Promise<User | null> {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.id === id);
      
      if (!user) {
        return null;
      }
      
      return {
        id: user.id,
        employeeId: user.employee_id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation || '',
        status: user.status || 'offline',
        avatarUrl: user.avatar_url || ''
      };
    } catch (error) {
      console.error("Error fetching employee:", error);
      return null;
    }
  },
  
  async getAllEmployees(): Promise<User[]> {
    return this.getAllUsers();
  },
  
  async registerEmployee(userData: {
    name: string;
    email: string;
    password: string;
    department: string;
    designation: string;
    role: "admin" | "employee" | "hr" | "manager";
  }, registrationCode: string): Promise<User | null> {
    try {
      // First validate the registration code
      const isValidCode = await registrationService.validateRegistrationCode(registrationCode);
      if (!isValidCode) {
        throw new Error("Invalid registration code");
      }
      
      // Generate a unique employee ID
      const employeeId = generateEmployeeId();
      
      // In a real implementation, this would store the user in the database
      // For demonstration, we'll use localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (users.some((u: any) => u.email === userData.email)) {
        throw new Error("Email already registered");
      }
      
      const newUser = {
        id: users.length + 1,
        employee_id: employeeId,
        name: userData.name,
        email: userData.email,
        password_hash: userData.password, // In a real app, this would be hashed
        role: userData.role,
        department: userData.department,
        designation: userData.designation,
        status: 'offline' as 'offline', // Type assertion to fix type error
        created_at: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Mark the registration code as used
      await registrationService.markCodeAsUsed(registrationCode);
      
      // Return the created user
      const createdUser: User = {
        id: newUser.id,
        employeeId: newUser.employee_id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        designation: newUser.designation || '',
        status: newUser.status,
        avatarUrl: ''
      };
      
      return createdUser;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },
  
  async getAllUsers(): Promise<User[]> {
    try {
      // In a real implementation, this would query the database
      // For demonstration, we'll use localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      return users.map((user: any) => ({
        id: user.id,
        employeeId: user.employee_id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation || '',
        status: user.status || 'offline',
        avatarUrl: user.avatar_url || ''
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },
  
  async updateUserStatus(userId: number, status: 'online' | 'offline' | 'away'): Promise<boolean> {
    try {
      // In a real implementation, this would update the database
      // For demonstration, we'll use localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      const updatedUsers = users.map((user: any) => {
        if (user.id === userId) {
          return { ...user, status };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update current user if it's the logged-in user
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, status }));
      }
      
      return true;
    } catch (error) {
      console.error("Error updating user status:", error);
      return false;
    }
  },
  
  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },
  
  logout(): void {
    localStorage.removeItem('currentUser');
  }
};
