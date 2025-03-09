import { useState, useEffect } from 'react';
import { User, AttendanceRecord, LeaveRequest, PayrollRecord, OvertimeRecord } from '@/models/types';

interface AdminData {
  users: User[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payrollRecords: PayrollRecord[];
  overtimeRecords: OvertimeRecord[];
  loading: boolean;
  error: string | null;
}

// Helper function to generate a mock employee ID
const generateEmployeeId = () => {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `AT-${year}-${randomPart}`;
};

// Update mock data with employeeId
export function useAdminData() {
  const [data, setData] = useState<AdminData>({
    users: [],
    attendanceRecords: [],
    leaveRequests: [],
    payrollRecords: [],
    overtimeRecords: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Mock data generation for demo purposes
    const mockUsers: User[] = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "employee",
        department: "Engineering",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        employeeId: generateEmployeeId(),
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "password123",
        role: "admin",
        department: "Management",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        employeeId: generateEmployeeId(),
      },
      {
        id: 3,
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        password: "password123",
        role: "employee",
        department: "Design",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
        employeeId: generateEmployeeId(),
      },
      {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        password: "password123",
        role: "employee",
        department: "Marketing",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        employeeId: generateEmployeeId(),
      },
      {
        id: 5,
        name: "Michael Wilson",
        email: "michael.wilson@example.com",
        password: "password123",
        role: "employee",
        department: "HR",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        employeeId: generateEmployeeId(),
      },
      {
        id: 6, 
        name: "Sarah Brown",
        email: "sarah.brown@example.com",
        password: "password123",
        role: "employee",
        department: "Finance",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        employeeId: generateEmployeeId(),
      },
      {
        id: 7,
        name: "David Lee",
        email: "david.lee@example.com",
        password: "password123",
        role: "employee",
        department: "Engineering",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        employeeId: generateEmployeeId(),
      },
      {
        id: 8,
        name: "Jennifer Taylor",
        email: "jennifer.taylor@example.com",
        password: "password123",
        role: "employee",
        department: "Sales",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
        employeeId: generateEmployeeId(),
      },
    ];

    const mockAttendanceRecords: AttendanceRecord[] = [
      { id: 1, userId: 1, date: "October 10, 2024", checkIn: "2024-10-10T08:55:00", checkOut: "2024-10-10T17:00:00" },
      { id: 2, userId: 2, date: "October 10, 2024", checkIn: "2024-10-10T09:02:00", checkOut: "2024-10-10T17:30:00" },
      { id: 3, userId: 1, date: "October 11, 2024", checkIn: "2024-10-11T08:50:00", checkOut: "2024-10-11T17:10:00" },
      { id: 4, userId: 2, date: "October 11, 2024", checkIn: "2024-10-11T09:05:00", checkOut: "2024-10-11T17:20:00" },
    ];

    const mockLeaveRequests: LeaveRequest[] = [
      { id: 1, userId: 3, startDate: "October 15, 2024", endDate: "October 17, 2024", reason: "Vacation", status: "approved" },
      { id: 2, userId: 4, startDate: "October 16, 2024", endDate: "October 16, 2024", reason: "Sick leave", status: "pending" },
    ];

    const mockPayrollRecords: PayrollRecord[] = [
      { id: 1, userId: 5, date: "October 31, 2024", amount: 5000, status: "paid" },
      { id: 2, userId: 6, date: "October 31, 2024", amount: 6000, status: "pending" },
    ];

    const mockOvertimeRecords: OvertimeRecord[] = [
      { id: 1, userId: 7, date: "October 12, 2024", hours: 2, description: "Project deadline", status: "approved" },
      { id: 2, userId: 8, date: "October 13, 2024", hours: 3, description: "Urgent task", status: "pending" },
    ];

    setData({
      users: mockUsers,
      attendanceRecords: mockAttendanceRecords,
      leaveRequests: mockLeaveRequests,
      payrollRecords: mockPayrollRecords,
      overtimeRecords: mockOvertimeRecords,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...data,
  };
}
