
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, AttendanceRecord, LeaveRequest } from "@/services/api";
import { User } from "@/context/AuthContext";
import AttendanceStats from "@/components/admin/AttendanceStats";
import EmployeeTable from "@/components/admin/EmployeeTable";
import ReportsPanel from "@/components/admin/ReportsPanel";
import LeaveManagement from "@/components/admin/LeaveManagement";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Redirect if not logged in or not an admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (!isAdmin) {
      toast.error("You don't have permission to access the admin panel");
      navigate("/dashboard");
    }
  }, [user, isAdmin, navigate]);
  
  // Fetch employees, attendance records, and leave requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !isAdmin) return;
        
        setLoading(true);
        const [employeeData, attendanceData, leaveData] = await Promise.all([
          apiService.getAllEmployees(),
          apiService.getAllAttendance(),
          apiService.getAllLeaveRequests(),
        ]);
        
        setEmployees(employeeData);
        setAttendanceRecords(attendanceData);
        setLeaveRequests(leaveData);
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
  
  if (!user || !isAdmin) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Admin Panel</h1>
          <p className="text-muted-foreground">Manage employees and attendance</p>
        </div>
        
        <div className="mb-8">
          <AttendanceStats
            employees={employees}
            attendanceRecords={attendanceRecords}
          />
        </div>
        
        <Tabs defaultValue="employees" className="space-y-4">
          <TabsList>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="leave">Leave Requests</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="employees" className="space-y-4">
            <EmployeeTable
              employees={employees}
              attendanceRecords={attendanceRecords}
            />
          </TabsContent>
          
          <TabsContent value="leave">
            <LeaveManagement 
              leaveRequests={leaveRequests}
              employees={employees}
              loading={loading}
              onStatusUpdate={handleLeaveStatusUpdate}
            />
          </TabsContent>
          
          <TabsContent value="reports">
            <ReportsPanel />
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="p-8 text-center text-muted-foreground border rounded-lg">
              Settings feature coming soon
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
