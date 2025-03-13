
import { OvertimeRecord } from "../models/types";

export const overtimeService = {
  async getAllOvertime(): Promise<OvertimeRecord[]> {
    const storedOvertime = localStorage.getItem("mockOvertimeData");
    return storedOvertime ? JSON.parse(storedOvertime) : [];
  },

  async getUserOvertime(userId: number): Promise<OvertimeRecord[]> {
    const storedOvertime = localStorage.getItem("mockOvertimeData");
    const overtimeRecords: OvertimeRecord[] = storedOvertime ? JSON.parse(storedOvertime) : [];
    return overtimeRecords.filter(record => record.employeeId === userId);
  },
  
  async createOvertimeRequest(request: Omit<OvertimeRecord, 'id' | 'status' | 'approvedBy'>, employeeId: number): Promise<OvertimeRecord> {
    const storedOvertime = localStorage.getItem("mockOvertimeData");
    const overtimeRecords: OvertimeRecord[] = storedOvertime ? JSON.parse(storedOvertime) : [];
    
    const newOvertime: OvertimeRecord = {
      id: Math.floor(Math.random() * 10000),
      employeeId,
      date: request.date,
      hours: request.hours,
      rate: request.rate,
      reason: request.reason,
      status: "pending",
    };
    
    overtimeRecords.push(newOvertime);
    localStorage.setItem("mockOvertimeData", JSON.stringify(overtimeRecords));
    return newOvertime;
  },
  
  async updateOvertimeStatus(id: number, status: "approved" | "rejected", approvedBy: number): Promise<OvertimeRecord | null> {
    const storedOvertime = localStorage.getItem("mockOvertimeData");
    if (!storedOvertime) return null;
    
    let overtimeRecords: OvertimeRecord[] = JSON.parse(storedOvertime);
    const recordIndex = overtimeRecords.findIndex(record => record.id === id);
    
    if (recordIndex === -1) return null;
    
    overtimeRecords[recordIndex] = {
      ...overtimeRecords[recordIndex],
      status,
      approvedBy,
    };
    
    localStorage.setItem("mockOvertimeData", JSON.stringify(overtimeRecords));
    return overtimeRecords[recordIndex];
  },

  async submitOvertimeRequest(userId: number, request: { date: string, hours: number, rate: number, reason: string }): Promise<OvertimeRecord> {
    return this.createOvertimeRequest(request, userId);
  }
};
