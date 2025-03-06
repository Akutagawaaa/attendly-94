
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, AttendanceRecord, LeaveRequest } from "@/services/api";
import CheckInOut from "@/components/dashboard/CheckInOut";
import AttendanceCard from "@/components/dashboard/AttendanceCard";
import ActivityLog from "@/components/dashboard/ActivityLog";
import ProfileCard from "@/components/dashboard/ProfileCard";
import LeaveRequestForm from "@/components/dashboard/LeaveRequestForm";
import LeaveHistory from "@/components/dashboard/LeaveHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  // Fetch attendance records and leave requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        
        setLoading(true);
        const [records, leaves] = await Promise.all([
          apiService.getUserAttendance(user.id),
          apiService.getUserLeaveRequests(user.id)
        ]);
        
        setAttendanceRecords(records);
        setLeaveRequests(leaves);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  // Check if user is checked in today
  const today = new Date();
  const formattedToday = today.toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const todayRecord = attendanceRecords.find(
    (record) => record.date === formattedToday
  );
  
  const isCheckedIn = !!(todayRecord && !todayRecord.checkOut);
  
  // Refresh attendance records and leave requests
  const refreshData = async () => {
    if (!user) return;
    
    try {
      const [records, leaves] = await Promise.all([
        apiService.getUserAttendance(user.id),
        apiService.getUserLeaveRequests(user.id)
      ]);
      
      setAttendanceRecords(records);
      setLeaveRequests(leaves);
    } catch (error) {
      console.error("Failed to refresh data", error);
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">{new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        
        <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList className="mb-2">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="leave">Leave & Absence</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <CheckInOut
                  onCheckInOut={refreshData}
                  checkedIn={isCheckedIn}
                  lastCheckIn={todayRecord?.checkIn || null}
                />
              </div>
              
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                  <AttendanceCard
                    todayRecord={todayRecord || null}
                    weeklyRecords={attendanceRecords}
                  />
                  <ActivityLog records={attendanceRecords} />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="leave">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <LeaveRequestForm onSubmit={refreshData} />
              </div>
              <div>
                <LeaveHistory leaveRequests={leaveRequests} loading={loading} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="profile">
            <ProfileCard />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
