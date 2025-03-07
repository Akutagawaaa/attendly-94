
import { LeaveRequest } from "../models/types";

export const leaveService = {
  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    const storedRequests = localStorage.getItem("mockLeaveRequests");
    return storedRequests ? JSON.parse(storedRequests) : [];
  },
  
  async getUserLeaveRequests(userId: number): Promise<LeaveRequest[]> {
    const storedRequests = localStorage.getItem("mockLeaveRequests");
    const leaveRequests: LeaveRequest[] = storedRequests ? JSON.parse(storedRequests) : [];
    return leaveRequests.filter(request => request.employeeId === userId);
  },
  
  async createLeaveRequest(request: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'type'>, employeeId: number): Promise<LeaveRequest> {
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
  },
  
  async updateLeaveRequestStatus(id: number, status: "approved" | "rejected"): Promise<LeaveRequest | null> {
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
};
