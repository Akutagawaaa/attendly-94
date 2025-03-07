
import { useState, useEffect } from "react";
import { apiService, User, AttendanceRecord, LeaveRequest, PayrollRecord, OvertimeRecord } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export function useAdminData() {
  const { user, isAdmin } = useAuth();
  const [employees, setEmployees] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [overtimeRecords, setOvertimeRecords] = useState<OvertimeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch employees, attendance records, leave requests, payroll records, and overtime records
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !isAdmin) return;
        
        setLoading(true);
        
        // Ensure local storage has the necessary mock data structures
        if (!localStorage.getItem("mockPayrollData")) {
          localStorage.setItem("mockPayrollData", JSON.stringify([]));
        }
        
        if (!localStorage.getItem("mockOvertimeData")) {
          localStorage.setItem("mockOvertimeData", JSON.stringify([]));
        }
        
        const [employeeData, attendanceData, leaveData, payrollData, overtimeData] = await Promise.all([
          apiService.getAllEmployees(),
          apiService.getAllAttendance(),
          apiService.getAllLeaveRequests(),
          apiService.getAllPayroll(),
          apiService.getAllOvertime()
        ]);
        
        // Handle type conversion properly
        setEmployees(employeeData as User[]);
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
      await apiService.updateLeaveRequestStatus(id, status);
      
      // Refresh leave requests
      const updatedLeaveRequests = await apiService.getAllLeaveRequests();
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
      const updatedPayrollRecords = await apiService.getAllPayroll();
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
      const updatedOvertimeRecords = await apiService.getAllOvertime();
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
      const updatedAttendanceRecords = await apiService.getAllAttendance();
      setAttendanceRecords(updatedAttendanceRecords);
      toast.success("Attendance records updated successfully");
    } catch (error) {
      console.error("Failed to refresh attendance data", error);
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
