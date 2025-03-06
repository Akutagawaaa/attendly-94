
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceRecord } from "@/services/api";
import { User } from "@/context/AuthContext";
import { Users, Clock, CheckCheck, UserX } from "lucide-react";

interface AttendanceStatsProps {
  employees: User[];
  attendanceRecords: AttendanceRecord[];
}

export default function AttendanceStats({ employees, attendanceRecords }: AttendanceStatsProps) {
  // Calculate today's date
  const today = new Date();
  const formattedToday = today.toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // Get today's records
  const todayRecords = attendanceRecords.filter(
    (record) => record.date === formattedToday
  );
  
  // Calculate statistics
  const totalEmployees = employees.length;
  
  // Present: Checked in but not checked out
  const presentEmployees = new Set(
    todayRecords
      .filter((record) => record.checkIn && !record.checkOut)
      .map((record) => record.employeeId)
  ).size;
  
  // Completed: Checked in and checked out
  const completedEmployees = new Set(
    todayRecords
      .filter((record) => record.checkIn && record.checkOut)
      .map((record) => record.employeeId)
  ).size;
  
  // Absent: Not checked in
  const checkedInEmployeeIds = new Set(todayRecords.map((record) => record.employeeId));
  const absentEmployees = employees.filter(
    (employee) => !checkedInEmployeeIds.has(employee.id)
  ).length;
  
  const stats = [
    {
      id: 1,
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      title: "Present",
      value: presentEmployees,
      icon: Clock,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 3,
      title: "Completed",
      value: completedEmployees,
      icon: CheckCheck,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 4,
      title: "Absent",
      value: absentEmployees,
      icon: UserX,
      color: "bg-orange-100 text-orange-600",
    },
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.id} className="hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`rounded-full p-2 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
