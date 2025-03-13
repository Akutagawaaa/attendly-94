
import { ResetPasswordRequest } from "../models/types";
import { db } from "../config/db";
import { toast } from "sonner";

// Helper function to generate a random token
const generateRandomToken = () => {
  return Math.random().toString(36).substring(2, 34);
};

export const passwordService = {
  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some((u: any) => u.email === email);
      
      if (!userExists) {
        return false;
      }
      
      // Generate token
      const token = generateRandomToken();
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24); // Token valid for 24 hours
      
      // Store token in localStorage
      const resetTokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '[]');
      
      // Remove any existing tokens for this email
      const filteredTokens = resetTokens.filter((t: any) => t.email !== email);
      
      // Add new token
      filteredTokens.push({
        email,
        token,
        expiry_date: expiryDate.toISOString(),
        is_used: false,
        created_at: new Date().toISOString()
      });
      
      localStorage.setItem('passwordResetTokens', JSON.stringify(filteredTokens));
      
      // In a real-world app, we would send an email with the reset link
      // For now, we'll just console log it
      console.log(`Password reset link: /reset-password?token=${token}&email=${email}`);
      
      return true;
    } catch (error) {
      console.error("Error requesting password reset:", error);
      return false;
    }
  },
  
  async validateResetToken(token: string, email: string): Promise<boolean> {
    try {
      const resetTokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '[]');
      const now = new Date();
      
      const validToken = resetTokens.find((t: any) => 
        t.token === token && 
        t.email === email && 
        new Date(t.expiry_date) > now && 
        !t.is_used
      );
      
      return !!validToken;
    } catch (error) {
      console.error("Error validating reset token:", error);
      return false;
    }
  },
  
  async resetPassword(email: string, token: string, newPassword: string): Promise<boolean> {
    try {
      // Validate token first
      const isValid = await this.validateResetToken(token, email);
      if (!isValid) {
        return false;
      }
      
      // Update the user's password in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      const updatedUsers = users.map((user: any) => {
        if (user.email === email) {
          return { ...user, password_hash: newPassword }; // In a real app, this would be hashed
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Mark the token as used
      const resetTokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '[]');
      
      const updatedTokens = resetTokens.map((t: any) => {
        if (t.token === token && t.email === email) {
          return { ...t, is_used: true };
        }
        return t;
      });
      
      localStorage.setItem('passwordResetTokens', JSON.stringify(updatedTokens));
      
      return true;
    } catch (error) {
      console.error("Error resetting password:", error);
      return false;
    }
  }
};
