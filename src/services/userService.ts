
import { User, EmployeeRegistration } from "../models/types";
import { db } from "../config/db";
import { registrationService } from "./registrationService";
import { toast } from "sonner";

export const userService = {
  async login(email: string, password: string): Promise<User | null> {
    try {
      // In a real app, we would hash the password and compare hashes
      const result = await db.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      // Simple password check (in a real app, use bcrypt.compare)
      const user = result.rows[0];
      if (user.password_hash !== password) {
        return null;
      }
      
      return {
        id: user.id,
        employeeId: user.employee_id,
        name: user.name,
        email: user.email,
        role: user.role as "admin" | "employee" | "hr" | "manager",
        department: user.department,
        designation: user.designation,
        status: user.status as "available" | "busy" | "away" | "offline",
        address: user.address,
        phone: user.phone,
        avatarUrl: user.avatar_url,
        organizationLogo: user.organization_logo
      };
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  },
  
  async logout(): Promise<void> {
    // Nothing to do here with the database
    return Promise.resolve();
  },
  
  async getUser(id: number): Promise<User | null> {
    try {
      const result = await db.query(
        `SELECT * FROM users WHERE id = $1`,
        [id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const user = result.rows[0];
      return {
        id: user.id,
        employeeId: user.employee_id,
        name: user.name,
        email: user.email,
        role: user.role as "admin" | "employee" | "hr" | "manager",
        department: user.department,
        designation: user.designation,
        status: user.status as "available" | "busy" | "away" | "offline",
        address: user.address,
        phone: user.phone,
        avatarUrl: user.avatar_url,
        organizationLogo: user.organization_logo
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },
  
  async getEmployeeById(id: number): Promise<User | null> {
    return this.getUser(id);
  },
  
  async getAllEmployees(): Promise<User[]> {
    try {
      const result = await db.query(
        `SELECT * FROM users ORDER BY name`
      );
      
      return result.rows.map(user => ({
        id: user.id,
        employeeId: user.employee_id,
        name: user.name,
        email: user.email,
        role: user.role as "admin" | "employee" | "hr" | "manager",
        department: user.department,
        designation: user.designation,
        status: user.status as "available" | "busy" | "away" | "offline",
        address: user.address,
        phone: user.phone,
        avatarUrl: user.avatar_url,
        organizationLogo: user.organization_logo
      }));
    } catch (error) {
      console.error("Error fetching all employees:", error);
      return [];
    }
  },
  
  async registerEmployee(data: EmployeeRegistration, registrationCode: string): Promise<User> {
    try {
      // Validate registration code
      const isValid = await registrationService.validateRegistrationCode(registrationCode);
      if (!isValid) {
        throw new Error("Invalid or expired registration code");
      }
      
      // Check if email already exists
      const emailCheck = await db.query(
        `SELECT id FROM users WHERE email = $1`,
        [data.email]
      );
      
      if (emailCheck.rows.length > 0) {
        throw new Error("Email already registered");
      }
      
      // Generate employee ID
      const year = new Date().getFullYear();
      const countResult = await db.query('SELECT COUNT(*) FROM users');
      const count = parseInt(countResult.rows[0].count);
      const randomPart = 1000 + count;
      const employeeId = `AT-${year}-${randomPart}`;
      
      // Insert new user
      const result = await db.query(
        `INSERT INTO users (
          employee_id, name, email, password_hash, role, department, designation, avatar_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          employeeId,
          data.name,
          data.email,
          data.password, // In a real app, this would be hashed
          data.role,
          data.department,
          data.designation,
          data.avatarUrl || null
        ]
      );
      
      // Mark registration code as used
      await registrationService.markCodeAsUsed(registrationCode);
      
      const user = result.rows[0];
      return {
        id: user.id,
        employeeId: user.employee_id,
        name: user.name,
        email: user.email,
        role: user.role as "admin" | "employee" | "hr" | "manager",
        department: user.department,
        designation: user.designation,
        status: user.status as "available" | "busy" | "away" | "offline",
        address: user.address,
        phone: user.phone,
        avatarUrl: user.avatar_url,
        organizationLogo: user.organization_logo
      };
    } catch (error) {
      console.error("Error registering employee:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to register employee");
    }
  },
  
  async updateUserStatus(userId: number, status: "available" | "busy" | "away" | "offline"): Promise<boolean> {
    try {
      await db.query(
        `UPDATE users SET status = $1 WHERE id = $2`,
        [status, userId]
      );
      
      return true;
    } catch (error) {
      console.error("Error updating user status:", error);
      return false;
    }
  }
};
