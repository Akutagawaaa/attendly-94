
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import AdminTabs from "@/components/admin/AdminTabs";
import OrganizationLogo from "@/components/admin/OrganizationLogo";
import { User, AttendanceRecord, LeaveRequest, PayrollRecord, OvertimeRecord } from "@/models/types";
import { userService } from "@/services/userService";
import { attendanceService } from "@/services/attendanceService";
import { leaveService } from "@/services/leaveService";
import { payrollService } from "@/services/payrollService";
import { overtimeService } from "@/services/overtimeService";
import { toast } from "sonner";

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [employees, setEmployees] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [overtimeRecords, setOvertimeRecords] = useState<OvertimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (!isAdmin) {
      navigate("/dashboard");
    }
    
    fetchData();
  }, [user, isAdmin, navigate]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data needed for admin dashboard
      const employeesData = await userService.getAllEmployees();
      const attendanceData = await attendanceService.getAllAttendance();
      const leaveData = await leaveService.getAllLeaveRequests();
      const payrollData = await payrollService.getAllPayroll();
      const overtimeData = await overtimeService.getAllOvertime();
      
      setEmployees(employeesData);
      setAttendanceRecords(attendanceData);
      setLeaveRequests(leaveData);
      setPayrollRecords(payrollData);
      setOvertimeRecords(overtimeData);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };
  
  const handleLeaveStatusUpdate = async (id: number, status: "approved" | "rejected") => {
    try {
      await leaveService.updateLeaveRequestStatus(id, status);
      toast.success(`Leave request ${status}`);
      // Refresh leave requests
      const leaveData = await leaveService.getAllLeaveRequests();
      setLeaveRequests(leaveData);
    } catch (error) {
      console.error("Failed to update leave status", error);
      toast.error("Failed to update leave status");
    }
  };
  
  const handlePayrollUpdate = async () => {
    try {
      // Refresh payroll data
      const payrollData = await payrollService.getAllPayroll();
      setPayrollRecords(payrollData);
      toast.success("Payroll data updated");
    } catch (error) {
      console.error("Failed to update payroll data", error);
      toast.error("Failed to update payroll data");
    }
  };
  
  const handleOvertimeUpdate = async () => {
    try {
      // Refresh overtime data
      const overtimeData = await overtimeService.getAllOvertime();
      setOvertimeRecords(overtimeData);
      toast.success("Overtime data updated");
    } catch (error) {
      console.error("Failed to update overtime data", error);
      toast.error("Failed to update overtime data");
    }
  };
  
  const handleOpenOverrideModal = (employeeId: number) => {
    // This would be handled by AdminOverrideModal component
    console.log("Opening override modal for employee:", employeeId);
  };
  
  const refreshAttendanceData = async () => {
    try {
      const attendanceData = await attendanceService.getAllAttendance();
      setAttendanceRecords(attendanceData);
      toast.success("Attendance data refreshed");
    } catch (error) {
      console.error("Failed to refresh attendance data", error);
      toast.error("Failed to refresh attendance data");
    }
  };
  
  if (!user || !isAdmin) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-6 mb-16">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage employees, attendance, and system settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            {/* Admin statistics could go here */}
          </div>
          <div className="md:col-span-1">
            <OrganizationLogo />
          </div>
        </div>
        
        <AdminTabs 
          employees={employees}
          attendanceRecords={attendanceRecords}
          leaveRequests={leaveRequests}
          payrollRecords={payrollRecords}
          overtimeRecords={overtimeRecords}
          loading={loading}
          onLeaveStatusUpdate={handleLeaveStatusUpdate}
          onPayrollUpdate={handlePayrollUpdate}
          onOvertimeUpdate={handleOvertimeUpdate}
          onOpenOverrideModal={handleOpenOverrideModal}
          refreshAttendanceData={refreshAttendanceData}
        />
      </div>
    </Layout>
  );
}
