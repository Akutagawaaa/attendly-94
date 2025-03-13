
import { ResetPasswordRequest } from "../models/types";
import { db } from "../config/db";
import { toast } from "sonner";
import crypto from 'crypto';

export const passwordService = {
  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      // Check if user exists
      const userResult = await db.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );
      
      if (userResult.rows.length === 0) {
        return false;
      }
      
      // Generate token
      const token = crypto.randomBytes(32).toString('hex');
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24); // Token valid for 24 hours
      
      // Store token in database
      await db.query(
        `INSERT INTO password_reset_tokens (email, token, expiry_date)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) 
         DO UPDATE SET token = $2, expiry_date = $3, is_used = FALSE`,
        [email, token, expiryDate]
      );
      
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
      const result = await db.query(
        `SELECT * FROM password_reset_tokens
         WHERE token = $1 AND email = $2 AND expiry_date > NOW() AND is_used = FALSE`,
        [token, email]
      );
      
      return result.rows.length > 0;
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
      
      // Hash the new password (in a real app, use bcrypt or similar)
      const passwordHash = newPassword; // In a real app, this would be hashed
      
      // Update the user's password
      await db.query(
        "UPDATE users SET password_hash = $1 WHERE email = $2",
        [passwordHash, email]
      );
      
      // Mark the token as used
      await db.query(
        "UPDATE password_reset_tokens SET is_used = TRUE WHERE token = $1",
        [token]
      );
      
      return true;
    } catch (error) {
      console.error("Error resetting password:", error);
      return false;
    }
  }
};
