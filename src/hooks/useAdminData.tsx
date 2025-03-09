
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
        employeeId: generateEmployeeId(),
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "employee",
        department: "Engineering",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      },
      {
        id: 2,
        employeeId: generateEmployeeId(),
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "password123",
        role: "admin",
        department: "Management",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      },
      {
        id: 3,
        employeeId: generateEmployeeId(),
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        password: "password123",
        role: "employee",
        department: "Design",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      },
      {
        id: 4,
        employeeId: generateEmployeeId(),
        name: "Emily Davis",
        email: "emily.davis@example.com",
        password: "password123",
        role: "employee",
        department: "Marketing",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      },
      {
        id: 5,
        employeeId: generateEmployeeId(),
        name: "Michael Wilson",
        email: "michael.wilson@example.com",
        password: "password123",
        role: "employee",
        department: "HR",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      },
      {
        id: 6, 
        employeeId: generateEmployeeId(),
        name: "Sarah Brown",
        email: "sarah.brown@example.com",
        password: "password123",
        role: "employee",
        department: "Finance",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      {
        id: 7,
        employeeId: generateEmployeeId(),
        name: "David Lee",
        email: "david.lee@example.com",
        password: "password123",
        role: "employee",
        department: "Engineering",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      },
      {
        id: 8,
        employeeId: generateEmployeeId(),
        name: "Jennifer Taylor",
        email: "jennifer.taylor@example.com",
        password: "password123",
        role: "employee",
        department: "Sales",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
      },
    ];

    const mockAttendanceRecords: AttendanceRecord[] = [
      { id: 1, employeeId: 1, date: "October 10, 2024", checkIn: "2024-10-10T08:55:00", checkOut: "2024-10-10T17:00:00" },
      { id: 2, employeeId: 2, date: "October 10, 2024", checkIn: "2024-10-10T09:02:00", checkOut: "2024-10-10T17:30:00" },
      { id: 3, employeeId: 1, date: "October 11, 2024", checkIn: "2024-10-11T08:50:00", checkOut: "2024-10-11T17:10:00" },
      { id: 4, employeeId: 2, date: "October 11, 2024", checkIn: "2024-10-11T09:05:00", checkOut: "2024-10-11T17:20:00" },
    ];

    const mockLeaveRequests: LeaveRequest[] = [
      { id: 1, employeeId: 3, startDate: "October 15, 2024", endDate: "October 17, 2024", reason: "Vacation", status: "approved", type: "vacation", createdAt: "2024-10-05T10:00:00" },
      { id: 2, employeeId: 4, startDate: "October 16, 2024", endDate: "October 16, 2024", reason: "Sick leave", status: "pending", type: "sick", createdAt: "2024-10-08T14:30:00" },
    ];

    const mockPayrollRecords: PayrollRecord[] = [
      { id: 1, employeeId: 5, month: "October", year: 2024, baseSalary: 5000, overtimePay: 200, bonus: 100, deductions: 300, netSalary: 5000, status: "paid", processedDate: "2024-10-31T10:00:00", paymentDate: "2024-10-31T14:00:00" },
      { id: 2, employeeId: 6, month: "October", year: 2024, baseSalary: 6000, overtimePay: 0, bonus: 0, deductions: 400, netSalary: 5600, status: "processed" },
    ];

    const mockOvertimeRecords: OvertimeRecord[] = [
      { id: 1, employeeId: 7, date: "October 12, 2024", hours: 2, rate: 1.5, reason: "Project deadline", status: "approved", approvedBy: 2 },
      { id: 2, employeeId: 8, date: "October 13, 2024", hours: 3, rate: 1.5, reason: "Urgent task", status: "pending" },
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
