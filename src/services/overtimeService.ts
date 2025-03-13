
import { OvertimeRecord } from "../models/types";
import { db } from "../config/db";
import { toast } from "sonner";

export const overtimeService = {
  async getAllOvertime(): Promise<OvertimeRecord[]> {
    try {
      const result = await db.query(`
        SELECT * FROM overtime
        ORDER BY date DESC
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        employeeId: row.employee_id,
        date: row.date,
        hours: row.hours,
        rate: row.rate,
        reason: row.reason,
        status: row.status as "pending" | "approved" | "rejected",
        approvedBy: row.approved_by
      }));
    } catch (error) {
      console.error("Error fetching overtime records:", error);
      toast.error("Failed to fetch overtime records");
      return [];
    }
  },

  async getUserOvertime(userId: number): Promise<OvertimeRecord[]> {
    try {
      const result = await db.query(`
        SELECT * FROM overtime
        WHERE employee_id = $1
        ORDER BY date DESC
      `, [userId]);
      
      return result.rows.map(row => ({
        id: row.id,
        employeeId: row.employee_id,
        date: row.date,
        hours: row.hours,
        rate: row.rate,
        reason: row.reason,
        status: row.status as "pending" | "approved" | "rejected",
        approvedBy: row.approved_by
      }));
    } catch (error) {
      console.error("Error fetching user overtime records:", error);
      toast.error("Failed to fetch your overtime records");
      return [];
    }
  },
  
  async createOvertimeRequest(request: Omit<OvertimeRecord, 'id' | 'status' | 'approvedBy'>, employeeId: number): Promise<OvertimeRecord> {
    try {
      const result = await db.query(`
        INSERT INTO overtime (
          employee_id, date, hours, rate, reason, status
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [
        employeeId,
        request.date,
        request.hours,
        request.rate,
        request.reason,
        "pending"
      ]);
      
      const row = result.rows[0];
      
      return {
        id: row.id,
        employeeId: row.employee_id,
        date: row.date,
        hours: row.hours,
        rate: row.rate,
        reason: row.reason,
        status: row.status as "pending" | "approved" | "rejected",
        approvedBy: row.approved_by
      };
    } catch (error) {
      console.error("Error creating overtime request:", error);
      toast.error("Failed to submit overtime request");
      throw new Error("Failed to create overtime request");
    }
  },
  
  async updateOvertimeStatus(id: number, status: "approved" | "rejected", approvedBy: number): Promise<OvertimeRecord | null> {
    try {
      const result = await db.query(`
        UPDATE overtime
        SET status = $1, approved_by = $2
        WHERE id = $3
        RETURNING *
      `, [status, approvedBy, id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      
      return {
        id: row.id,
        employeeId: row.employee_id,
        date: row.date,
        hours: row.hours,
        rate: row.rate,
        reason: row.reason,
        status: row.status as "pending" | "approved" | "rejected",
        approvedBy: row.approved_by
      };
    } catch (error) {
      console.error("Error updating overtime status:", error);
      toast.error("Failed to update overtime status");
      return null;
    }
  },

  async submitOvertimeRequest(userId: number, request: { date: string, hours: number, rate: number, reason: string }): Promise<OvertimeRecord> {
    return this.createOvertimeRequest(request, userId);
  }
};
