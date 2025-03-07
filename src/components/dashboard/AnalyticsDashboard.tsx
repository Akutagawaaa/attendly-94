
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService, AttendanceRecord, OvertimeRecord } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { formatDate, formatTime } from "@/lib/utils";
import { Clock, Briefcase, CalendarDays, ArrowUpRight } from "lucide-react";

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [overtimeRecords, setOvertimeRecords] = useState<OvertimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    averageHoursPerDay: 0,
    punchInTrend: [] as { day: string, time: string }[],
    daysWorked: 0,
    totalOvertime: 0,
  });
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const [attendance, overtime] = await Promise.all([
          apiService.getUserAttendance(user.id),
          apiService.getUserOvertime(user.id)
        ]);
        
        setAttendanceRecords(attendance);
        setOvertimeRecords(overtime);
        
        // Calculate metrics
        calculateMetrics(attendance, overtime);
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const calculateMetrics = (attendance: AttendanceRecord[], overtime: OvertimeRecord[]) => {
    // Calculate average hours per day
    const completedDays = attendance.filter(record => record.checkIn && record.checkOut);
    
    const totalHours = completedDays.reduce((total, record) => {
      const checkIn = new Date(record.checkIn as string);
      const checkOut = new Date(record.checkOut as string);
      const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);
    
    const averageHours = completedDays.length > 0 
      ? totalHours / completedDays.length 
      : 0;
    
    // Calculate punch-in trend
    const punchInTrend = attendance
      .filter(record => record.checkIn)
      .slice(-7) // Last 7 days
      .map(record => {
        const date = new Date(record.date);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const checkInTime = new Date(record.checkIn as string);
        return {
          day,
          time: checkInTime.getHours() + (checkInTime.getMinutes() / 60),
          formattedTime: formatTime(checkInTime)
        };
      });
    
    // Calculate total overtime hours
    const totalOvertimeHours = overtime.reduce((total, record) => {
      return total + record.hours;
    }, 0);
    
    setMetrics({
      averageHoursPerDay: parseFloat(averageHours.toFixed(2)),
      punchInTrend,
      daysWorked: completedDays.length,
      totalOvertime: parseFloat(totalOvertimeHours.toFixed(2))
    });
  };
  
  // Prepare attendance patterns data for pie chart
  const prepareAttendancePatternData = () => {
    if (attendanceRecords.length === 0) return [];
    
    // Count early, on-time, and late check-ins
    let early = 0;
    let onTime = 0;
    let late = 0;
    
    attendanceRecords.forEach(record => {
      if (!record.checkIn) return;
      
      const checkInTime = new Date(record.checkIn);
      const checkInHour = checkInTime.getHours();
      const checkInMinute = checkInTime.getMinutes();
      
      if (checkInHour < 9) {
        early++;
      } else if (checkInHour === 9 && checkInMinute <= 5) {
        onTime++;
      } else {
        late++;
      }
    });
    
    return [
      { name: 'Early (Before 9:00)', value: early },
      { name: 'On Time (9:00-9:05)', value: onTime },
      { name: 'Late (After 9:05)', value: late }
    ];
  };
  
  const attendancePatternData = prepareAttendancePatternData();
  const pieColors = ['#10b981', '#3b82f6', '#f59e0b'];
  
  if (loading) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-primary rounded-full" role="status" aria-label="loading"></div>
          <div className="mt-2 text-sm text-muted-foreground">Loading analytics...</div>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Average Hours/Day</CardTitle>
              <CardDescription>Working hour average</CardDescription>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageHoursPerDay.toFixed(1)} hrs</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {metrics.daysWorked} working days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Overtime</CardTitle>
              <CardDescription>Cumulative hours</CardDescription>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOvertime.toFixed(1)} hrs</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-green-600 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                {overtimeRecords.filter(r => r.status === 'approved').length}
              </span>
              <span>approved requests</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <CardDescription>Days worked this month</CardDescription>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.daysWorked} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()} days this month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Check-in Times</CardTitle>
            <CardDescription>Your check-in time pattern for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {metrics.punchInTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metrics.punchInTrend}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="day" />
                    <YAxis 
                      domain={[8, 10]} 
                      ticks={[8, 8.5, 9, 9.5, 10]} 
                      tickFormatter={(value) => {
                        const hours = Math.floor(value);
                        const minutes = Math.round((value - hours) * 60);
                        return `${hours}:${minutes.toString().padStart(2, '0')}`;
                      }}
                    />
                    <Tooltip 
                      formatter={(value: any) => {
                        const hours = Math.floor(value);
                        const minutes = Math.round((value - hours) * 60);
                        return [`${hours}:${minutes.toString().padStart(2, '0')}`, 'Check-in Time'];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="time" fill="#6366f1" name="Check-in Time" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Not enough data to display check-in patterns
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Attendance Pattern</CardTitle>
            <CardDescription>Distribution of arrival times</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {attendancePatternData.some(item => item.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendancePatternData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {attendancePatternData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`${value} days`, 'Count']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Not enough data to display attendance patterns
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
