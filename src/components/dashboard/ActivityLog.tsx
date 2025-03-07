
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceRecord } from "@/services/api";
import { formatDateShort, formatTime } from "@/lib/utils";
import { LogIn, LogOut } from "lucide-react";

interface ActivityLogProps {
  records: AttendanceRecord[];
}

export default function ActivityLog({ records }: ActivityLogProps) {
  // Sort records by date, most recent first
  const sortedRecords = [...records].sort((a, b) => {
    // Get the latest action from each record
    const aTime = a.checkOut ? new Date(a.checkOut).getTime() : a.checkIn ? new Date(a.checkIn).getTime() : 0;
    const bTime = b.checkOut ? new Date(b.checkOut).getTime() : b.checkIn ? new Date(b.checkIn).getTime() : 0;
    return bTime - aTime;
  });
  
  // Take only the 5 most recent records
  const recentRecords = sortedRecords.slice(0, 5);
  
  // Convert records to activity items
  const activities: ActivityItem[] = [];
  
  recentRecords.forEach((record) => {
    // Add check-in activity if it exists
    if (record.checkIn) {
      activities.push({
        id: `${record.id}-in`,
        date: record.date,
        time: formatTime(new Date(record.checkIn)),
        timestamp: new Date(record.checkIn).getTime(),
        type: "check-in",
        recordId: record.id,
      });
    }
    
    // Add check-out activity if exists
    if (record.checkOut) {
      activities.push({
        id: `${record.id}-out`,
        date: record.date,
        time: formatTime(new Date(record.checkOut)),
        timestamp: new Date(record.checkOut).getTime(),
        type: "check-out",
        recordId: record.id,
      });
    }
  });
  
  // Sort activities by timestamp, most recent first
  activities.sort((a, b) => b.timestamp - a.timestamp);
  
  // Take only the most recent 5 activities
  const recentActivities = activities.slice(0, 5);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
        <CardDescription>Your latest check-ins and check-outs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            <ul className="space-y-3">
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </ul>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityItem {
  id: string;
  date: string;
  time: string;
  timestamp: number;
  type: "check-in" | "check-out";
  recordId: number;
}

const ActivityItem = ({ activity }: { activity: ActivityItem }) => {
  const isCheckIn = activity.type === "check-in";
  
  return (
    <li className="flex items-center gap-3 py-1.5 text-sm animate-fade-in">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isCheckIn ? "bg-green-100" : "bg-orange-100"}`}>
        {isCheckIn ? (
          <LogIn className={`h-4 w-4 text-green-600`} />
        ) : (
          <LogOut className={`h-4 w-4 text-orange-600`} />
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-medium">
          {isCheckIn ? "Checked in" : "Checked out"}
        </p>
        <div className="flex gap-1 text-xs text-muted-foreground">
          <span>{activity.date}</span>
          <span>•</span>
          <span>{activity.time}</span>
        </div>
      </div>
    </li>
  );
};
