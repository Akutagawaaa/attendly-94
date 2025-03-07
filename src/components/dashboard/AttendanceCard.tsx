
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatTime, getDuration } from "@/lib/utils";
import { AttendanceRecord } from "@/services/api";
import { Clock } from "lucide-react";

interface AttendanceCardProps {
  todayRecord: AttendanceRecord | null;
  weeklyRecords: AttendanceRecord[];
}

export default function AttendanceCard({ todayRecord, weeklyRecords }: AttendanceCardProps) {
  // Calculate weekly hours
  const totalWeeklyHours = weeklyRecords.reduce((total, record) => {
    if (record.checkIn && record.checkOut) {
      // Convert string dates to Date objects before using getTime()
      const checkInDate = new Date(record.checkIn);
      const checkOutDate = new Date(record.checkOut);
      const duration = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60);
      return total + duration;
    }
    return total;
  }, 0);
  
  // Format hours to 1 decimal place
  const formattedWeeklyHours = totalWeeklyHours.toFixed(1);
  
  // Calculate progress percentage (assuming 40-hour work week)
  const progressPercentage = Math.min((totalWeeklyHours / 40) * 100, 100);
  
  // Get today's duration if checked in
  const todayDuration = todayRecord && todayRecord.checkIn 
    ? (todayRecord.checkOut 
      ? getDuration(new Date(todayRecord.checkIn), new Date(todayRecord.checkOut))
      : "Currently working")
    : "Not checked in";
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Weekly Summary</CardTitle>
        <CardDescription>Your attendance this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium">Weekly Hours</p>
              <span className="text-2xl font-bold">{formattedWeeklyHours}</span>
              <span className="text-sm text-muted-foreground ml-1">/ 40 hrs</span>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="pt-4 space-y-2">
            <h4 className="text-sm font-medium">Today</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check in</span>
                <span className="font-medium">
                  {todayRecord?.checkIn ? formatTime(new Date(todayRecord.checkIn)) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check out</span>
                <span className="font-medium">
                  {todayRecord?.checkOut ? formatTime(new Date(todayRecord.checkOut)) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{todayDuration}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
