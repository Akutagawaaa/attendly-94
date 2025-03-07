
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AttendanceStats from "@/components/admin/AttendanceStats";
import AdminOverrideModal from "@/components/admin/AdminOverrideModal";
import AdminTabs from "@/components/admin/AdminTabs";
import { useAdminData } from "@/hooks/useAdminData";

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  
  const {
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
  } = useAdminData();
  
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
  
  // Handle clicking "Override Check-in/out" for an employee
  const handleOpenOverrideModal = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    setShowOverrideModal(true);
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
        
        <AdminTabs
          employees={employees}
          attendanceRecords={attendanceRecords}
          leaveRequests={leaveRequests}
          payrollRecords={payrollRecords}
          overtimeRecords={overtimeRecords}
          loading={loading}
          onLeaveStatusUpdate={handleLeaveStatusUpdate}
          onPayrollUpdate={refreshPayrollData}
          onOvertimeUpdate={refreshOvertimeData}
          onOpenOverrideModal={handleOpenOverrideModal}
          refreshAttendanceData={refreshAttendanceData}
        />
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
