
import { RegistrationCode } from "../models/types";
import { db } from "../config/db";
import { supabase } from "../integrations/supabase/client";

// Helper function to generate a random code
const generateRandomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const registrationService = {
  async createRegistrationCode(expiryDays: number, createdBy: number): Promise<RegistrationCode> {
    try {
      // Generate random code
      const code = generateRandomCode();
      
      // Calculate expiry date
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);
      
      // In a real implementation, this would store the code in the database
      // For now, we'll use localStorage to simulate persistence
      const registrationCodes = JSON.parse(localStorage.getItem('registrationCodes') || '[]');
      const newCode = {
        code,
        expiry_date: expiryDate.toISOString(),
        is_used: false,
        created_by: createdBy
      };
      
      registrationCodes.push(newCode);
      localStorage.setItem('registrationCodes', JSON.stringify(registrationCodes));
      
      console.log('Created registration code:', newCode);
      
      const registrationCode: RegistrationCode = {
        code: newCode.code,
        expiryDate: new Date(newCode.expiry_date),
        isUsed: newCode.is_used
      };
      
      return registrationCode;
    } catch (error) {
      console.error("Error creating registration code:", error);
      throw new Error("Failed to create registration code");
    }
  },
  
  async validateRegistrationCode(code: string): Promise<boolean> {
    try {
      // In a real implementation, this would query the database
      // For now, we'll use localStorage to simulate persistence
      const registrationCodes = JSON.parse(localStorage.getItem('registrationCodes') || '[]');
      const now = new Date();
      
      const validCode = registrationCodes.find((c: any) => 
        c.code === code && 
        new Date(c.expiry_date) > now && 
        !c.is_used
      );
      
      return !!validCode;
    } catch (error) {
      console.error("Error validating registration code:", error);
      return false;
    }
  },
  
  async markCodeAsUsed(code: string): Promise<boolean> {
    try {
      // In a real implementation, this would update the database
      // For now, we'll use localStorage to simulate persistence
      const registrationCodes = JSON.parse(localStorage.getItem('registrationCodes') || '[]');
      
      const updatedCodes = registrationCodes.map((c: any) => {
        if (c.code === code) {
          return { ...c, is_used: true };
        }
        return c;
      });
      
      localStorage.setItem('registrationCodes', JSON.stringify(updatedCodes));
      
      return true;
    } catch (error) {
      console.error("Error marking code as used:", error);
      return false;
    }
  }
};
