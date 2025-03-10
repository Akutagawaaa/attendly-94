import { AttendanceRecord } from "../models/types";
import { formatDate } from "../lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const attendanceService = {
  async getAllAttendance(): Promise<AttendanceRecord[]> {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Transform Supabase data to match our AttendanceRecord type
      return (data || []).map(record => ({
        id: record.id,
        employeeId: record.user_id,
        date: formatDate(new Date(record.check_in)),
        checkIn: record.check_in,
        checkOut: record.check_out,
      }));
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      
      // Fallback to local storage if Supabase fails
      const storedAttendance = localStorage.getItem("mockAttendanceData");
      return storedAttendance ? JSON.parse(storedAttendance) : [];
    }
  },
  
  async getUserAttendance(userId: number): Promise<AttendanceRecord[]> {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Transform Supabase data to match our AttendanceRecord type
      return (data || []).map(record => ({
        id: record.id,
        employeeId: record.user_id,
        date: formatDate(new Date(record.check_in)),
        checkIn: record.check_in,
        checkOut: record.check_out,
      }));
    } catch (error) {
      console.error("Error fetching user attendance records:", error);
      
      // Fallback to local storage if Supabase fails
      const storedAttendance = localStorage.getItem("mockAttendanceData");
      const attendanceRecords: AttendanceRecord[] = storedAttendance ? JSON.parse(storedAttendance) : [];
      return attendanceRecords.filter(record => record.employeeId === userId);
    }
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
    try {
      const today = formatDate(new Date());
      
      // First check if the user has already checked in today
      const { data: existingRecords } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", userId)
        .gte("check_in", new Date().toISOString().split('T')[0]);
      
      if (existingRecords && existingRecords.length > 0) {
        throw new Error("You have already checked in today");
      }
      
      // If not, create a new check-in
      const checkInTime = new Date().toISOString();
      const { data, error } = await supabase
        .from("attendance")
        .insert([{ user_id: userId, check_in: checkInTime }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform to match our AttendanceRecord type
      const newRecord: AttendanceRecord = {
        id: data.id,
        employeeId: data.user_id,
        date: formatDate(new Date(data.check_in)),
        checkIn: data.check_in,
        checkOut: null,
      };
      
      return newRecord;
    } catch (error) {
      console.error("Error during check-in:", error);
      
      // Fallback to old method if Supabase fails
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
    }
  },
  
  async checkOut(userId: number): Promise<AttendanceRecord | null> {
    try {
      // Find the user's active check-in for today
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", userId)
        .gte("check_in", today)
        .is("check_out", null)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        throw new Error("No active check-in found for today");
      }
      
      // Update the record with check-out time
      const checkOutTime = new Date().toISOString();
      const { data: updatedData, error: updateError } = await supabase
        .from("attendance")
        .update({ check_out: checkOutTime })
        .eq("id", data.id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // Transform to match our AttendanceRecord type
      return {
        id: updatedData.id,
        employeeId: updatedData.user_id,
        date: formatDate(new Date(updatedData.check_in)),
        checkIn: updatedData.check_in,
        checkOut: updatedData.check_out,
      };
    } catch (error) {
      console.error("Error during check-out:", error);
      
      // Fallback to old method if Supabase fails
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
    }
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
