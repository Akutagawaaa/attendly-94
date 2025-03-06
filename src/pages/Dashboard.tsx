
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, AttendanceRecord } from "@/services/api";
import CheckInOut from "@/components/dashboard/CheckInOut";
import AttendanceCard from "@/components/dashboard/AttendanceCard";
import ActivityLog from "@/components/dashboard/ActivityLog";
import ProfileCard from "@/components/dashboard/ProfileCard";
import LeaveRequestForm from "@/components/dashboard/LeaveRequestForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  // Fetch attendance records
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        if (!user) return;
        
        setLoading(true);
        const records = await apiService.getUserAttendance(user.id);
        setAttendanceRecords(records);
      } catch (error) {
        console.error("Failed to fetch attendance", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendance();
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
  
  // Refresh attendance records
  const refreshAttendance = async () => {
    if (!user) return;
    
    try {
      const records = await apiService.getUserAttendance(user.id);
      setAttendanceRecords(records);
    } catch (error) {
      console.error("Failed to refresh attendance", error);
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
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="leave">Leave Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <CheckInOut
                  onCheckInOut={refreshAttendance}
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
          
          <TabsContent value="profile">
            <ProfileCard />
          </TabsContent>
          
          <TabsContent value="leave">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <LeaveRequestForm />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Leave History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No leave requests found</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
