
import { AttendanceRecord } from "../models/types";
import { formatDate } from "../lib/utils";

export const attendanceService = {
  async getAllAttendance(): Promise<AttendanceRecord[]> {
    const storedAttendance = localStorage.getItem("mockAttendanceData");
    return storedAttendance ? JSON.parse(storedAttendance) : [];
  },
  
  async getUserAttendance(userId: number): Promise<AttendanceRecord[]> {
    const storedAttendance = localStorage.getItem("mockAttendanceData");
    const attendanceRecords: AttendanceRecord[] = storedAttendance ? JSON.parse(storedAttendance) : [];
    return attendanceRecords.filter(record => record.employeeId === userId);
  },
  
  async createAttendanceRecord(record: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
    const storedAttendance = localStorage.getItem("mockAttendanceData");
    const attendanceRecords: AttendanceRecord[] = storedAttendance ? JSON.parse(storedAttendance) : [];
    
    const newRecord: AttendanceRecord = {
      id: Math.floor(Math.random() * 10000),
      ...record,
    };
    
    attendanceRecords.push(newRecord);
    localStorage.setItem("mockAttendanceData", JSON.stringify(attendanceRecords));
    return newRecord;
  },
  
  async updateAttendanceRecord(id: number, updates: Partial<AttendanceRecord>): Promise<AttendanceRecord | null> {
    const storedAttendance = localStorage.getItem("mockAttendanceData");
    if (!storedAttendance) return null;
    
    let attendanceRecords: AttendanceRecord[] = JSON.parse(storedAttendance);
    const recordIndex = attendanceRecords.findIndex(record => record.id === id);
    
    if (recordIndex === -1) return null;
    
    attendanceRecords[recordIndex] = {
      ...attendanceRecords[recordIndex],
      ...updates,
    };
    
    localStorage.setItem("mockAttendanceData", JSON.stringify(attendanceRecords));
    return attendanceRecords[recordIndex];
  },
  
  async deleteAttendanceRecord(id: number): Promise<boolean> {
    const storedAttendance = localStorage.getItem("mockAttendanceData");
    if (!storedAttendance) return false;
    
    let attendanceRecords: AttendanceRecord[] = JSON.parse(storedAttendance);
    const initialLength = attendanceRecords.length;
    attendanceRecords = attendanceRecords.filter(record => record.id !== id);
    
    if (attendanceRecords.length === initialLength) return false;
    
    localStorage.setItem("mockAttendanceData", JSON.stringify(attendanceRecords));
    return true;
  },
  
  async checkIn(userId: number): Promise<AttendanceRecord> {
    const today = formatDate(new Date());
    
    const attendanceRecords = await this.getAllAttendance();
    const existingRecord = attendanceRecords.find(
      record => record.employeeId === userId && record.date === today
    );
    
    if (existingRecord) {
      throw new Error("You have already checked in today");
    }
    
    const newRecord: AttendanceRecord = {
      id: Math.floor(Math.random() * 10000),
      employeeId: userId,
      date: today,
      checkIn: new Date().toISOString(),
      checkOut: null,
    };
    
    attendanceRecords.push(newRecord);
    localStorage.setItem("mockAttendanceData", JSON.stringify(attendanceRecords));
    return newRecord;
  },
  
  async checkOut(userId: number): Promise<AttendanceRecord | null> {
    const today = formatDate(new Date());
    
    const attendanceRecords = await this.getAllAttendance();
    const recordIndex = attendanceRecords.findIndex(
      record => record.employeeId === userId && record.date === today && record.checkIn && !record.checkOut
    );
    
    if (recordIndex === -1) {
      throw new Error("No active check-in found for today");
    }
    
    attendanceRecords[recordIndex].checkOut = new Date().toISOString();
    localStorage.setItem("mockAttendanceData", JSON.stringify(attendanceRecords));
    return attendanceRecords[recordIndex];
  },
  
  async adminOverrideCheckIn(employeeId: number, checkInTime: Date, adminId: number): Promise<AttendanceRecord | null> {
    const today = formatDate(new Date());
    
    const attendanceRecords = await this.getAllAttendance();
    const existingRecord = attendanceRecords.find(
      record => 
        record.employeeId === employeeId && 
        record.date === today
    );
    
    if (existingRecord) {
      existingRecord.checkIn = checkInTime.toISOString();
      await this.updateAttendanceRecord(existingRecord.id, existingRecord);
      return existingRecord;
    } else {
      const newRecord: AttendanceRecord = {
        id: Math.floor(Math.random() * 10000),
        employeeId: employeeId,
        date: today,
        checkIn: checkInTime.toISOString(),
        checkOut: null,
      };
      
      attendanceRecords.push(newRecord);
      localStorage.setItem("mockAttendanceData", JSON.stringify(attendanceRecords));
      return newRecord;
    }
  },
  
  async adminOverrideCheckOut(employeeId: number, checkOutTime: Date, adminId: number): Promise<AttendanceRecord | null> {
    const today = formatDate(new Date());
    
    const attendanceRecords = await this.getAllAttendance();
    const existingRecord = attendanceRecords.find(
      record => 
        record.employeeId === employeeId && 
        record.date === today
    );
    
    if (existingRecord) {
      existingRecord.checkOut = checkOutTime.toISOString();
      await this.updateAttendanceRecord(existingRecord.id, existingRecord);
      return existingRecord;
    } else {
      const newRecord: AttendanceRecord = {
        id: Math.floor(Math.random() * 10000),
        employeeId: employeeId,
        date: today,
        checkIn: null,
        checkOut: checkOutTime.toISOString(),
      };
      
      attendanceRecords.push(newRecord);
      localStorage.setItem("mockAttendanceData", JSON.stringify(attendanceRecords));
      return newRecord;
    }
  }
};
