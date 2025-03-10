
import { LeaveRequest } from "../models/types";
import { supabase } from "@/integrations/supabase/client";

export const leaveService = {
  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Transform Supabase data to match our LeaveRequest type
      return (data || []).map(record => ({
        id: record.id,
        employeeId: record.user_id,
        startDate: record.start_date,
        endDate: record.end_date,
        reason: record.reason || "",
        status: record.status,
        type: record.type,
        createdAt: record.created_at,
      }));
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      
      // Fallback to local storage if Supabase fails
      const storedRequests = localStorage.getItem("mockLeaveRequests");
      return storedRequests ? JSON.parse(storedRequests) : [];
    }
  },
  
  async getUserLeaveRequests(userId: number): Promise<LeaveRequest[]> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Transform Supabase data to match our LeaveRequest type
      return (data || []).map(record => ({
        id: record.id,
        employeeId: record.user_id,
        startDate: record.start_date,
        endDate: record.end_date,
        reason: record.reason || "",
        status: record.status,
        type: record.type,
        createdAt: record.created_at,
      }));
    } catch (error) {
      console.error("Error fetching user leave requests:", error);
      
      // Fallback to local storage if Supabase fails
      const storedRequests = localStorage.getItem("mockLeaveRequests");
      const leaveRequests: LeaveRequest[] = storedRequests ? JSON.parse(storedRequests) : [];
      return leaveRequests.filter(request => request.employeeId === userId);
    }
  },
  
  async createLeaveRequest(request: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'type'>, employeeId: number): Promise<LeaveRequest> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .insert([{
          user_id: employeeId,
          start_date: request.startDate,
          end_date: request.endDate,
          reason: request.reason,
          type: "annual", // Default type
          status: "pending"
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform to match our LeaveRequest type
      return {
        id: data.id,
        employeeId: data.user_id,
        startDate: data.start_date,
        endDate: data.end_date,
        reason: data.reason || "",
        status: data.status,
        type: data.type,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error("Error creating leave request:", error);
      
      // Fallback to old method if Supabase fails
      const storedRequests = localStorage.getItem("mockLeaveRequests");
      const leaveRequests: LeaveRequest[] = storedRequests ? JSON.parse(storedRequests) : [];
      
      const newRequest: LeaveRequest = {
        id: Math.floor(Math.random() * 10000),
        employeeId,
        startDate: request.startDate,
        endDate: request.endDate,
        reason: request.reason,
        status: "pending",
        type: "annual",
        createdAt: new Date().toISOString(),
      };
      
      leaveRequests.push(newRequest);
      localStorage.setItem("mockLeaveRequests", JSON.stringify(leaveRequests));
      return newRequest;
    }
  },
  
  async updateLeaveRequestStatus(id: number, status: "approved" | "rejected"): Promise<LeaveRequest | null> {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform to match our LeaveRequest type
      return {
        id: data.id,
        employeeId: data.user_id,
        startDate: data.start_date,
        endDate: data.end_date,
        reason: data.reason || "",
        status: data.status,
        type: data.type,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error("Error updating leave request status:", error);
      
      // Fallback to old method if Supabase fails
      const storedRequests = localStorage.getItem("mockLeaveRequests");
      if (!storedRequests) return null;
      
      let leaveRequests: LeaveRequest[] = JSON.parse(storedRequests);
      const requestIndex = leaveRequests.findIndex(request => request.id === id);
      
      if (requestIndex === -1) return null;
      
      leaveRequests[requestIndex] = {
        ...leaveRequests[requestIndex],
        status,
      };
      
      localStorage.setItem("mockLeaveRequests", JSON.stringify(leaveRequests));
      return leaveRequests[requestIndex];
    }
  }
};
