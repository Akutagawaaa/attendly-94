
import { useState, useEffect } from "react";
import { User, AttendanceRecord, LeaveRequest, PayrollRecord, OvertimeRecord } from "@/models/types";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { attendanceService } from "@/services/attendanceService";
import { leaveService } from "@/services/leaveService";
import { payrollService } from "@/services/payrollService";
import { overtimeService } from "@/services/overtimeService";

export function useAdminData() {
  const { user, isAdmin } = useAuth();
  const [employees, setEmployees] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [overtimeRecords, setOvertimeRecords] = useState<OvertimeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize mock data if it doesn't exist
  const initializeMockData = () => {
    // Initialize payroll data if not exists
    if (!localStorage.getItem("mockPayrollData")) {
      localStorage.setItem("mockPayrollData", JSON.stringify([]));
    }
    
    // Initialize overtime data if not exists
    if (!localStorage.getItem("mockOvertimeData")) {
      localStorage.setItem("mockOvertimeData", JSON.stringify([]));
    }
    
    // Initialize attendance data if not exists
    if (!localStorage.getItem("mockAttendanceData")) {
      localStorage.setItem("mockAttendanceData", JSON.stringify([]));
    }
    
    // Initialize leave requests if not exists
    if (!localStorage.getItem("mockLeaveRequests")) {
      localStorage.setItem("mockLeaveRequests", JSON.stringify([]));
    }
  };

  // Fetch employees, attendance records, leave requests, payroll records, and overtime records
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !isAdmin) return;
        
        setLoading(true);
        
        // Initialize mock data structures if they don't exist
        initializeMockData();
        
        const [employeeData, attendanceData, leaveData, payrollData, overtimeData] = await Promise.all([
          userService.getAllEmployees(),
          attendanceService.getAllAttendance(),
          leaveService.getAllLeaveRequests(),
          payrollService.getAllPayroll(),
          overtimeService.getAllOvertime()
        ]);
        
        setEmployees(employeeData);
        setAttendanceRecords(attendanceData);
        setLeaveRequests(leaveData);
        setPayrollRecords(payrollData);
        setOvertimeRecords(overtimeData);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, isAdmin]);

  // Update leave request status
  const handleLeaveStatusUpdate = async (id: number, status: "approved" | "rejected") => {
    try {
      await leaveService.updateLeaveRequestStatus(id, status);
      
      // Refresh leave requests
      const updatedLeaveRequests = await leaveService.getAllLeaveRequests();
      setLeaveRequests(updatedLeaveRequests);
      
      toast.success(`Leave request ${status} successfully`);
    } catch (error) {
      console.error(`Failed to ${status} leave request`, error);
      toast.error(`Failed to ${status} leave request`);
    }
  };

  // Refresh data after payroll updates
  const refreshPayrollData = async () => {
    if (!user || !isAdmin) return;
    
    try {
      const updatedPayrollRecords = await payrollService.getAllPayroll();
      setPayrollRecords(updatedPayrollRecords);
      toast.success("Payroll data refreshed");
    } catch (error) {
      console.error("Failed to refresh payroll data", error);
      toast.error("Failed to refresh payroll data");
    }
  };
  
  // Refresh data after overtime updates
  const refreshOvertimeData = async () => {
    if (!user || !isAdmin) return;
    
    try {
      const updatedOvertimeRecords = await overtimeService.getAllOvertime();
      setOvertimeRecords(updatedOvertimeRecords);
      toast.success("Overtime data refreshed");
    } catch (error) {
      console.error("Failed to refresh overtime data", error);
      toast.error("Failed to refresh overtime data");
    }
  };
  
  // Refresh attendance records
  const refreshAttendanceData = async () => {
    if (!user || !isAdmin) return;
    
    try {
      const updatedAttendanceRecords = await attendanceService.getAllAttendance();
      setAttendanceRecords(updatedAttendanceRecords);
      toast.success("Attendance records updated successfully");
    } catch (error) {
      console.error("Failed to refresh attendance data", error);
      toast.error("Failed to refresh attendance data");
    }
  };

  return {
    employees,
    attendanceRecords,
    leaveRequests,
    payrollRecords,
    overtimeRecords,
    loading,
    handleLeaveStatusUpdate,
    refreshPayrollData,
    refreshOvertimeData,
    refreshAttendanceData
  };
}
