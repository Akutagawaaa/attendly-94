
import { useState, useEffect } from "react";
import { User, AttendanceRecord, LeaveRequest, PayrollRecord, OvertimeRecord } from "@/models/types";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { attendanceService } from "@/services/attendanceService";
import { leaveService } from "@/services/leaveService";
import { payrollService } from "@/services/payrollService";
import { overtimeService } from "@/services/overtimeService";
import { formatDate } from "@/lib/utils";

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
    // Initialize users if not exists
    if (!localStorage.getItem("mockUsers")) {
      const mockUsers: User[] = [
        { 
          id: 1, 
          name: "Alex Johnson", 
          email: "employee@example.com", 
          password: "password", 
          role: "employee", 
          department: "Engineering",
          avatarUrl: "https://i.pravatar.cc/150?img=1"
        },
        { 
          id: 2, 
          name: "Emma Williams", 
          email: "admin@example.com", 
          password: "password", 
          role: "admin", 
          department: "HR",
          avatarUrl: "https://i.pravatar.cc/150?img=2"
        },
        { 
          id: 3, 
          name: "Michael Chen", 
          email: "michael@example.com", 
          password: "password", 
          role: "employee", 
          department: "Finance",
          avatarUrl: "https://i.pravatar.cc/150?img=3"
        },
        { 
          id: 4, 
          name: "Sarah Miller", 
          email: "sarah@example.com", 
          password: "password", 
          role: "employee", 
          department: "Marketing",
          avatarUrl: "https://i.pravatar.cc/150?img=4"
        },
        { 
          id: 5, 
          name: "David Rodriguez", 
          email: "david@example.com", 
          password: "password", 
          role: "employee", 
          department: "IT",
          avatarUrl: "https://i.pravatar.cc/150?img=5"
        },
        { 
          id: 6, 
          name: "Jennifer Lee", 
          email: "jennifer@example.com", 
          password: "password", 
          role: "employee", 
          department: "Sales",
          avatarUrl: "https://i.pravatar.cc/150?img=6"
        },
        { 
          id: 7, 
          name: "Robert Garcia", 
          email: "robert@example.com", 
          password: "password", 
          role: "employee", 
          department: "Customer Support",
          avatarUrl: "https://i.pravatar.cc/150?img=7"
        },
        { 
          id: 8, 
          name: "Lisa Wong", 
          email: "lisa@example.com", 
          password: "password", 
          role: "employee", 
          department: "Design",
          avatarUrl: "https://i.pravatar.cc/150?img=8"
        }
      ];
      localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
    }
    
    // Initialize attendance data if not exists
    if (!localStorage.getItem("mockAttendanceData")) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(today.getDate() - 2);
      
      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(today.getDate() - 3);
      
      const mockAttendance: AttendanceRecord[] = [
        { id: 1, employeeId: 1, date: formatDate(today), checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 55).toISOString(), checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 30).toISOString() },
        { id: 2, employeeId: 3, date: formatDate(today), checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 10).toISOString(), checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0).toISOString() },
        { id: 3, employeeId: 4, date: formatDate(today), checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 45).toISOString(), checkOut: null },
        { id: 4, employeeId: 5, date: formatDate(today), checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30).toISOString(), checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 45).toISOString() },
        { id: 5, employeeId: 1, date: formatDate(yesterday), checkIn: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 9, 0).toISOString(), checkOut: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 17, 15).toISOString() },
        { id: 6, employeeId: 3, date: formatDate(yesterday), checkIn: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 8, 50).toISOString(), checkOut: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 17, 45).toISOString() },
        { id: 7, employeeId: 4, date: formatDate(yesterday), checkIn: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 9, 5).toISOString(), checkOut: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 17, 0).toISOString() },
        { id: 8, employeeId: 6, date: formatDate(yesterday), checkIn: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 8, 40).toISOString(), checkOut: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 16, 30).toISOString() },
        { id: 9, employeeId: 7, date: formatDate(twoDaysAgo), checkIn: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 9, 15).toISOString(), checkOut: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 18, 30).toISOString() },
        { id: 10, employeeId: 8, date: formatDate(twoDaysAgo), checkIn: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 8, 50).toISOString(), checkOut: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 17, 20).toISOString() },
        { id: 11, employeeId: 5, date: formatDate(threeDaysAgo), checkIn: new Date(threeDaysAgo.getFullYear(), threeDaysAgo.getMonth(), threeDaysAgo.getDate(), 8, 30).toISOString(), checkOut: new Date(threeDaysAgo.getFullYear(), threeDaysAgo.getMonth(), threeDaysAgo.getDate(), 16, 45).toISOString() },
        { id: 12, employeeId: 6, date: formatDate(threeDaysAgo), checkIn: new Date(threeDaysAgo.getFullYear(), threeDaysAgo.getMonth(), threeDaysAgo.getDate(), 9, 0).toISOString(), checkOut: new Date(threeDaysAgo.getFullYear(), threeDaysAgo.getMonth(), threeDaysAgo.getDate(), 17, 30).toISOString() }
      ];
      localStorage.setItem("mockAttendanceData", JSON.stringify(mockAttendance));
    }
    
    // Initialize leave requests if not exists
    if (!localStorage.getItem("mockLeaveRequests")) {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      const twoWeeksLater = new Date(today);
      twoWeeksLater.setDate(today.getDate() + 14);
      
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      
      const mockLeaveRequests: LeaveRequest[] = [
        { 
          id: 1, 
          employeeId: 1, 
          startDate: nextWeek.toISOString(), 
          endDate: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 2).toISOString(), 
          reason: "Family vacation", 
          status: "pending", 
          type: "annual", 
          createdAt: today.toISOString() 
        },
        { 
          id: 2, 
          employeeId: 3, 
          startDate: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 5).toISOString(), 
          endDate: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 7).toISOString(), 
          reason: "Medical appointment", 
          status: "approved", 
          type: "sick", 
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString() 
        },
        { 
          id: 3, 
          employeeId: 4, 
          startDate: twoWeeksLater.toISOString(), 
          endDate: new Date(twoWeeksLater.getFullYear(), twoWeeksLater.getMonth(), twoWeeksLater.getDate() + 4).toISOString(), 
          reason: "Personal development seminar", 
          status: "pending", 
          type: "training", 
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toISOString() 
        },
        { 
          id: 4, 
          employeeId: 5, 
          startDate: new Date(twoWeeksLater.getFullYear(), twoWeeksLater.getMonth(), twoWeeksLater.getDate() + 10).toISOString(), 
          endDate: new Date(twoWeeksLater.getFullYear(), twoWeeksLater.getMonth(), twoWeeksLater.getDate() + 15).toISOString(), 
          reason: "Wedding and honeymoon", 
          status: "pending", 
          type: "annual", 
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3).toISOString() 
        },
        { 
          id: 5, 
          employeeId: 6, 
          startDate: lastWeek.toISOString(), 
          endDate: new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() + 2).toISOString(), 
          reason: "Illness", 
          status: "approved", 
          type: "sick", 
          createdAt: new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() - 1).toISOString() 
        },
        { 
          id: 6, 
          employeeId: 7, 
          startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString(), 
          endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString(), 
          reason: "Dental procedure", 
          status: "rejected", 
          type: "sick", 
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5).toISOString() 
        },
        { 
          id: 7, 
          employeeId: 8, 
          startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 20).toISOString(), 
          endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 25).toISOString(), 
          reason: "Family emergency", 
          status: "pending", 
          type: "emergency", 
          createdAt: today.toISOString() 
        }
      ];
      localStorage.setItem("mockLeaveRequests", JSON.stringify(mockLeaveRequests));
    }
    
    // Initialize payroll data if not exists
    if (!localStorage.getItem("mockPayrollData")) {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 15);
      const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 15);
      
      const mockPayrollRecords: PayrollRecord[] = [
        { 
          id: 1, 
          employeeId: 1, 
          month: "January", 
          year: 2023, 
          baseSalary: 5000, 
          overtimePay: 500, 
          bonus: 200, 
          deductions: 300, 
          netSalary: 5400, 
          status: "paid", 
          processedDate: twoMonthsAgo.toISOString(), 
          paymentDate: new Date(twoMonthsAgo.getFullYear(), twoMonthsAgo.getMonth(), twoMonthsAgo.getDate() + 2).toISOString() 
        },
        { 
          id: 2, 
          employeeId: 3, 
          month: "January", 
          year: 2023, 
          baseSalary: 4500, 
          overtimePay: 0, 
          bonus: 100, 
          deductions: 250, 
          netSalary: 4350, 
          status: "paid", 
          processedDate: twoMonthsAgo.toISOString(), 
          paymentDate: new Date(twoMonthsAgo.getFullYear(), twoMonthsAgo.getMonth(), twoMonthsAgo.getDate() + 2).toISOString() 
        },
        { 
          id: 3, 
          employeeId: 1, 
          month: "February", 
          year: 2023, 
          baseSalary: 5000, 
          overtimePay: 700, 
          bonus: 0, 
          deductions: 300, 
          netSalary: 5400, 
          status: "paid", 
          processedDate: lastMonth.toISOString(), 
          paymentDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate() + 2).toISOString() 
        },
        { 
          id: 4, 
          employeeId: 3, 
          month: "February", 
          year: 2023, 
          baseSalary: 4500, 
          overtimePay: 300, 
          bonus: 150, 
          deductions: 250, 
          netSalary: 4700, 
          status: "paid", 
          processedDate: lastMonth.toISOString(), 
          paymentDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate() + 2).toISOString() 
        },
        { 
          id: 5, 
          employeeId: 4, 
          month: "February", 
          year: 2023, 
          baseSalary: 4800, 
          overtimePay: 400, 
          bonus: 200, 
          deductions: 280, 
          netSalary: 5120, 
          status: "paid", 
          processedDate: lastMonth.toISOString(), 
          paymentDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate() + 2).toISOString() 
        },
        { 
          id: 6, 
          employeeId: 1, 
          month: "March", 
          year: 2023, 
          baseSalary: 5000, 
          overtimePay: 800, 
          bonus: 300, 
          deductions: 300, 
          netSalary: 5800, 
          status: "processed", 
          processedDate: today.toISOString(), 
          paymentDate: null 
        },
        { 
          id: 7, 
          employeeId: 3, 
          month: "March", 
          year: 2023, 
          baseSalary: 4500, 
          overtimePay: 500, 
          bonus: 200, 
          deductions: 250, 
          netSalary: 4950, 
          status: "processed", 
          processedDate: today.toISOString(), 
          paymentDate: null 
        },
        { 
          id: 8, 
          employeeId: 4, 
          month: "March", 
          year: 2023, 
          baseSalary: 4800, 
          overtimePay: 600, 
          bonus: 250, 
          deductions: 280, 
          netSalary: 5370, 
          status: "processed", 
          processedDate: today.toISOString(), 
          paymentDate: null 
        },
        { 
          id: 9, 
          employeeId: 5, 
          month: "March", 
          year: 2023, 
          baseSalary: 4600, 
          overtimePay: 400, 
          bonus: 150, 
          deductions: 260, 
          netSalary: 4890, 
          status: "processed", 
          processedDate: today.toISOString(), 
          paymentDate: null 
        }
      ];
      localStorage.setItem("mockPayrollData", JSON.stringify(mockPayrollRecords));
    }
    
    // Initialize overtime data if not exists
    if (!localStorage.getItem("mockOvertimeData")) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      
      const mockOvertimeRecords: OvertimeRecord[] = [
        { 
          id: 1, 
          employeeId: 1, 
          date: yesterday.toISOString(), 
          hours: 2.5, 
          rate: 1.5, 
          reason: "Project deadline", 
          status: "approved", 
          approvedBy: 2 
        },
        { 
          id: 2, 
          employeeId: 3, 
          date: yesterday.toISOString(), 
          hours: 3, 
          rate: 1.5, 
          reason: "System maintenance", 
          status: "approved", 
          approvedBy: 2 
        },
        { 
          id: 3, 
          employeeId: 4, 
          date: today.toISOString(), 
          hours: 2, 
          rate: 1.5, 
          reason: "Client meeting", 
          status: "pending", 
          approvedBy: null 
        },
        { 
          id: 4, 
          employeeId: 5, 
          date: lastWeek.toISOString(), 
          hours: 4, 
          rate: 2, 
          reason: "Emergency bug fix", 
          status: "approved", 
          approvedBy: 2 
        },
        { 
          id: 5, 
          employeeId: 6, 
          date: new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() + 1).toISOString(), 
          hours: 1.5, 
          rate: 1.5, 
          reason: "Inventory count", 
          status: "rejected", 
          approvedBy: 2 
        },
        { 
          id: 6, 
          employeeId: 7, 
          date: today.toISOString(), 
          hours: 3, 
          rate: 1.5, 
          reason: "Product launch preparation", 
          status: "pending", 
          approvedBy: null 
        },
        { 
          id: 7, 
          employeeId: 8, 
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString(), 
          hours: 2, 
          rate: 1.5, 
          reason: "Design review meeting", 
          status: "pending", 
          approvedBy: null 
        }
      ];
      localStorage.setItem("mockOvertimeData", JSON.stringify(mockOvertimeRecords));
    }

    // Initialize registration codes if not exists
    if (!localStorage.getItem("mockRegistrationCodes")) {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      
      const mockRegistrationCodes = [
        {
          code: "EMPL1234",
          expiryDate: nextMonth.toISOString(),
          isUsed: false
        },
        {
          code: "ADMN5678",
          expiryDate: nextMonth.toISOString(),
          isUsed: false
        },
        {
          code: "TEST9012",
          expiryDate: nextMonth.toISOString(),
          isUsed: true
        }
      ];
      localStorage.setItem("mockRegistrationCodes", JSON.stringify(mockRegistrationCodes));
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
