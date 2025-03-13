
import { RegistrationCode } from "../models/types";
import { db } from "../config/db";
import crypto from 'crypto';

export const registrationService = {
  async createRegistrationCode(expiryDays: number, createdBy: number): Promise<RegistrationCode> {
    try {
      // Generate random code
      const code = crypto.randomBytes(3).toString('hex').toUpperCase();
      
      // Calculate expiry date
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);
      
      // Store in database
      const result = await db.query(
        `INSERT INTO registration_codes (code, expiry_date, created_by)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [code, expiryDate, createdBy]
      );
      
      const registrationCode: RegistrationCode = {
        code: result.rows[0].code,
        expiryDate: new Date(result.rows[0].expiry_date),
        isUsed: result.rows[0].is_used
      };
      
      return registrationCode;
    } catch (error) {
      console.error("Error creating registration code:", error);
      throw new Error("Failed to create registration code");
    }
  },
  
  async validateRegistrationCode(code: string): Promise<boolean> {
    try {
      const result = await db.query(
        `SELECT * FROM registration_codes
         WHERE code = $1 AND expiry_date > NOW() AND is_used = FALSE`,
        [code]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      console.error("Error validating registration code:", error);
      return false;
    }
  },
  
  async markCodeAsUsed(code: string): Promise<boolean> {
    try {
      await db.query(
        `UPDATE registration_codes
         SET is_used = TRUE
         WHERE code = $1`,
        [code]
      );
      
      return true;
    } catch (error) {
      console.error("Error marking code as used:", error);
      return false;
    }
  }
};
