
import { useState } from "react";
import { User } from "@/services/api";
import { AttendanceRecord } from "@/services/api";
import { formatDate, formatTime } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Calendar, Search, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EmployeeTableProps {
  employees: User[];
  attendanceRecords: AttendanceRecord[];
}

export default function EmployeeTable({ employees, attendanceRecords }: EmployeeTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({
    key: "name",
    direction: "ascending",
  });
  
  // Filter records by search term
  const filteredEmployees = employees.filter((employee) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      employee.name.toLowerCase().includes(searchTermLower) ||
      employee.email.toLowerCase().includes(searchTermLower) ||
      employee.department?.toLowerCase().includes(searchTermLower) ||
      employee.role.toLowerCase().includes(searchTermLower)
    );
  });
  
  // Sort employees
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortConfig.key === "name") {
      return sortConfig.direction === "ascending"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortConfig.key === "role") {
      return sortConfig.direction === "ascending"
        ? a.role.localeCompare(b.role)
        : b.role.localeCompare(a.role);
    }
    if (sortConfig.key === "department") {
      const deptA = a.department || "";
      const deptB = b.department || "";
      return sortConfig.direction === "ascending"
        ? deptA.localeCompare(deptB)
        : deptB.localeCompare(deptA);
    }
    return 0;
  });
  
  // Calculate attendance statistics
  const getAttendanceStatus = (employeeId: number) => {
    const today = new Date();
    const formattedDate = formatDate(today);
    
    const todayRecord = attendanceRecords.find(
      (record) => record.employeeId === employeeId && record.date === formattedDate
    );
    
    if (!todayRecord) {
      return "absent";
    }
    
    if (todayRecord.checkIn && !todayRecord.checkOut) {
      return "present";
    }
    
    if (todayRecord.checkIn && todayRecord.checkOut) {
      return "completed";
    }
    
    return "absent";
  };
  
  const getLatestRecord = (employeeId: number) => {
    const employeeRecords = attendanceRecords.filter(
      (record) => record.employeeId === employeeId
    );
    
    if (employeeRecords.length === 0) {
      return null;
    }
    
    return employeeRecords.reduce((latest, record) => {
      const latestTime = record.checkOut 
        ? new Date(record.checkOut).getTime() 
        : record.checkIn 
          ? new Date(record.checkIn).getTime() 
          : 0;
          
      const currentTime = record.checkOut 
        ? new Date(record.checkOut).getTime() 
        : record.checkIn 
          ? new Date(record.checkIn).getTime() 
          : 0;
      
      return currentTime > latestTime ? record : latest;
    });
  };
  
  // Handle column sorting
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "ascending" ? "descending" : "ascending";
    }
    
    setSortConfig({ key, direction });
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "absent":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Employee
                    {sortConfig.key === "name" && (
                      <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("department")}
                >
                  <div className="flex items-center gap-1">
                    Department
                    {sortConfig.key === "department" && (
                      <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => requestSort("role")}
                >
                  <div className="flex items-center gap-1">
                    Role
                    {sortConfig.key === "role" && (
                      <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recent Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                sortedEmployees.map((employee) => {
                  const status = getAttendanceStatus(employee.id);
                  const latestRecord = getLatestRecord(employee.id);
                  
                  return (
                    <TableRow
                      key={employee.id}
                      className="hover:bg-muted/30 transition-colors animate-fade-in"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                            {employee.avatarUrl ? (
                              <img
                                src={employee.avatarUrl}
                                alt={employee.name}
                                className="h-full w-full object-cover rounded-full"
                              />
                            ) : (
                              <UserCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {employee.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department || "—"}</TableCell>
                      <TableCell className="capitalize">{employee.role}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "capitalize font-normal",
                            getStatusBadgeColor(status)
                          )}
                          variant="outline"
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {latestRecord ? (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {latestRecord.checkOut
                                ? `Checked out at ${formatTime(new Date(latestRecord.checkOut))}`
                                : latestRecord.checkIn 
                                  ? `Checked in at ${formatTime(new Date(latestRecord.checkIn))}`
                                  : "No activity"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No activity
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
