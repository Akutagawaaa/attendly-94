
import { LeaveRequest } from "../models/types";
import { db } from "../config/db";
import { toast } from "sonner";

export const leaveService = {
  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const result = await db.query(`
        SELECT * FROM leave_requests 
        ORDER BY created_at DESC
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        employeeId: row.employee_id,
        startDate: row.start_date,
        endDate: row.end_date,
        reason: row.description || "",
        status: row.status as "pending" | "approved" | "rejected",
        type: row.leave_type,
        createdAt: row.created_at,
      }));
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      toast.error("Failed to fetch leave requests");
      return [];
    }
  },
  
  async getUserLeaveRequests(userId: number): Promise<LeaveRequest[]> {
    try {
      const result = await db.query(`
        SELECT * FROM leave_requests 
        WHERE employee_id = $1
        ORDER BY created_at DESC
      `, [userId]);
      
      return result.rows.map(row => ({
        id: row.id,
        employeeId: row.employee_id,
        startDate: row.start_date,
        endDate: row.end_date,
        reason: row.description || "",
        status: row.status as "pending" | "approved" | "rejected",
        type: row.leave_type,
        createdAt: row.created_at,
      }));
    } catch (error) {
      console.error("Error fetching user leave requests:", error);
      toast.error("Failed to fetch your leave requests");
      return [];
    }
  },
  
  async createLeaveRequest(request: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'type'>, employeeId: number): Promise<LeaveRequest> {
    try {
      const result = await db.query(`
        INSERT INTO leave_requests (
          employee_id, start_date, end_date, description, leave_type, status
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [
        employeeId,
        request.startDate,
        request.endDate,
        request.reason,
        "annual", // Default type
        "pending"
      ]);
      
      const row = result.rows[0];
      
      return {
        id: row.id,
        employeeId: row.employee_id,
        startDate: row.start_date,
        endDate: row.end_date,
        reason: row.description || "",
        status: row.status as "pending" | "approved" | "rejected",
        type: row.leave_type,
        createdAt: row.created_at,
      };
    } catch (error) {
      console.error("Error creating leave request:", error);
      toast.error("Failed to submit leave request");
      throw new Error("Failed to create leave request");
    }
  },
  
  async updateLeaveRequestStatus(id: number, status: "approved" | "rejected"): Promise<LeaveRequest | null> {
    try {
      const result = await db.query(`
        UPDATE leave_requests
        SET status = $1
        WHERE id = $2
        RETURNING *
      `, [status, id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      
      return {
        id: row.id,
        employeeId: row.employee_id,
        startDate: row.start_date,
        endDate: row.end_date,
        reason: row.description || "",
        status: row.status as "pending" | "approved" | "rejected",
        type: row.leave_type,
        createdAt: row.created_at,
      };
    } catch (error) {
      console.error("Error updating leave request status:", error);
      toast.error("Failed to update leave request status");
      return null;
    }
  }
};
