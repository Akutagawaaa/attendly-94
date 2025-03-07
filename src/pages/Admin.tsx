
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, AttendanceRecord, LeaveRequest, PayrollRecord, OvertimeRecord } from "@/services/api";
import { User } from "@/services/api";
import AttendanceStats from "@/components/admin/AttendanceStats";
import EmployeeTable from "@/components/admin/EmployeeTable";
import ReportsPanel from "@/components/admin/ReportsPanel";
import LeaveManagement from "@/components/admin/LeaveManagement";
import PayrollManagement from "@/components/admin/PayrollManagement";
import OvertimeManagement from "@/components/admin/OvertimeManagement";
import AdminOverrideModal from "@/components/admin/AdminOverrideModal";
import RegistrationCodeGenerator from "@/components/admin/RegistrationCodeGenerator";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserCog, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [overtimeRecords, setOvertimeRecords] = useState<OvertimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  
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
  
  // Fetch employees, attendance records, leave requests, payroll records, and overtime records
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !isAdmin) return;
        
        setLoading(true);
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

  // Refresh data after payroll or overtime updates
  const refreshPayrollData = async () => {
    if (!user || !isAdmin) return;
    
    try {
      const updatedPayrollRecords = await apiService.getAllPayroll();
      setPayrollRecords(updatedPayrollRecords);
    } catch (error) {
      console.error("Failed to refresh payroll data", error);
    }
  };
  
  const refreshOvertimeData = async () => {
    if (!user || !isAdmin) return;
    
    try {
      const updatedOvertimeRecords = await apiService.getAllOvertime();
      setOvertimeRecords(updatedOvertimeRecords);
    } catch (error) {
      console.error("Failed to refresh overtime data", error);
    }
  };

  // Handle clicking "Override Check-in/out" for an employee
  const handleOpenOverrideModal = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    setShowOverrideModal(true);
  };
  
  // Refresh attendance records after an override
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
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="overtime">Overtime</TabsTrigger>
            <TabsTrigger value="leave">Leave Requests</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="attendance-override">Attendance Override</TabsTrigger>
            <TabsTrigger value="registration">Registration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="employees" className="space-y-4">
            <EmployeeTable
              employees={employees}
              attendanceRecords={attendanceRecords}
            />
          </TabsContent>
          
          <TabsContent value="payroll">
            <PayrollManagement
              payrollRecords={payrollRecords}
              employees={employees}
              loading={loading}
              onPayrollUpdate={refreshPayrollData}
            />
          </TabsContent>
          
          <TabsContent value="overtime">
            <OvertimeManagement
              overtimeRecords={overtimeRecords}
              employees={employees}
              loading={loading}
              onOvertimeUpdate={refreshOvertimeData}
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
          
          <TabsContent value="attendance-override">
            <div className="p-6 border rounded-lg bg-card">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-medium">Attendance Override</h3>
                  <p className="text-muted-foreground">Override check-in and check-out times for employees</p>
                </div>
                <Button 
                  onClick={() => setShowOverrideModal(true)}
                  className="flex items-center gap-2"
                >
                  <UserCog className="h-4 w-4" />
                  New Override
                </Button>
              </div>
              
              <div className="space-y-4">
                <p>Select an employee to manually adjust their check-in or check-out time.</p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employees.map(employee => (
                    <div key={employee.id} className="p-4 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => handleOpenOverrideModal(employee.id)}>
                      <h4 className="font-medium">{employee.name}</h4>
                      <p className="text-sm text-muted-foreground">{employee.department}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="registration">
            <div className="p-6 border rounded-lg bg-card">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-medium">Employee Registration</h3>
                  <p className="text-muted-foreground">Manage new employee registration</p>
                </div>
                <Button 
                  onClick={() => window.open('/register', '_blank')}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Registration Page
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <RegistrationCodeGenerator />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Registration Instructions</CardTitle>
                    <CardDescription>How to onboard new employees</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Generate a unique registration code from this panel</li>
                      <li>Share the code with the new employee</li>
                      <li>Direct them to the registration page at <code className="bg-muted px-1 py-0.5 rounded text-sm">/register</code></li>
                      <li>The employee creates their account using the provided code</li>
                      <li>Once registered, they can log in to the system</li>
                    </ol>
                    
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md text-sm">
                      <p className="font-medium text-yellow-800">Important:</p>
                      <p className="text-yellow-700">Registration codes are valid for a limited time and can only be used once. Generate new codes for each employee.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {showOverrideModal && (
        <AdminOverrideModal
          open={showOverrideModal}
          onOpenChange={setShowOverrideModal}
          employeeId={selectedEmployeeId}
          employees={employees}
          onOverrideComplete={refreshAttendanceData}
        />
      )}
    </Layout>
  );
}
