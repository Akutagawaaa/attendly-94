
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, AttendanceRecord, LeaveRequest, PayrollRecord, OvertimeRecord } from "@/models/types";
import EmployeeTable from "@/components/admin/EmployeeTable";
import PayrollManagement from "@/components/admin/PayrollManagement";
import OvertimeManagement from "@/components/admin/OvertimeManagement";
import LeaveManagement from "@/components/admin/LeaveManagement";
import ReportsPanel from "@/components/admin/ReportsPanel";
import AttendanceOverride from "@/components/admin/AttendanceOverride";
import RegistrationPanel from "@/components/admin/RegistrationPanel";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminTabsProps {
  employees: User[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payrollRecords: PayrollRecord[];
  overtimeRecords: OvertimeRecord[];
  loading: boolean;
  onLeaveStatusUpdate: (id: number, status: "approved" | "rejected") => Promise<void>;
  onPayrollUpdate: () => Promise<void>;
  onOvertimeUpdate: () => Promise<void>;
  onOpenOverrideModal: (employeeId: number) => void;
  refreshAttendanceData: () => Promise<void>;
}

export default function AdminTabs({
  employees,
  attendanceRecords,
  leaveRequests,
  payrollRecords,
  overtimeRecords,
  loading,
  onLeaveStatusUpdate,
  onPayrollUpdate,
  onOvertimeUpdate,
  onOpenOverrideModal,
  refreshAttendanceData
}: AdminTabsProps) {
  // Set up real-time subscriptions for admin data
  useEffect(() => {
    // Subscribe to attendance changes for all users
    const attendanceChannel = supabase
      .channel('public:attendance:admin')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'attendance' },
        (payload) => {
          console.log('Admin real-time attendance update:', payload);
          refreshAttendanceData();
        }
      )
      .subscribe();
      
    // Subscribe to leave request changes for all users
    const leaveChannel = supabase
      .channel('public:leave_requests:admin')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leave_requests' },
        (payload) => {
          console.log('Admin real-time leave request update:', payload);
          onPayrollUpdate();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(attendanceChannel);
      supabase.removeChannel(leaveChannel);
    };
  }, [refreshAttendanceData, onPayrollUpdate]);

  return (
    <Tabs defaultValue="employees" className="space-y-4">
      <div className="overflow-x-auto">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full min-w-max">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="overtime">Overtime</TabsTrigger>
          <TabsTrigger value="leave">Leave Requests</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="attendance-override">Attendance</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
        </TabsList>
      </div>
      
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
          onPayrollUpdate={onPayrollUpdate}
        />
      </TabsContent>
      
      <TabsContent value="overtime">
        <OvertimeManagement
          overtimeRecords={overtimeRecords}
          employees={employees}
          loading={loading}
          onOvertimeUpdate={onOvertimeUpdate}
        />
      </TabsContent>
      
      <TabsContent value="leave">
        <LeaveManagement 
          leaveRequests={leaveRequests}
          employees={employees}
          loading={loading}
          onStatusUpdate={onLeaveStatusUpdate}
        />
      </TabsContent>
      
      <TabsContent value="reports">
        <ReportsPanel />
      </TabsContent>
      
      <TabsContent value="attendance-override">
        <AttendanceOverride 
          employees={employees} 
          onOpenOverrideModal={onOpenOverrideModal} 
        />
      </TabsContent>
      
      <TabsContent value="registration">
        <RegistrationPanel />
      </TabsContent>
    </Tabs>
  );
}
