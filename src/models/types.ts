
export interface User {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "employee" | "hr" | "manager";
  department: string;
  designation?: string;
  status?: "available" | "busy" | "away" | "offline";
  address?: string;
  phone?: string;
  avatarUrl?: string;
  organizationLogo?: string;
}

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  type: string;
  createdAt: string;
}

export interface PayrollRecord {
  id: number;
  employeeId: number;
  month: string;
  year: number;
  baseSalary: number;
  overtimePay: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: "draft" | "processed" | "paid";
  processedDate?: string | null;
  paymentDate?: string | null;
}

export interface OvertimeRecord {
  id: number;
  employeeId: number;
  date: string;
  hours: number;
  rate: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: number | null;
}

export interface EmployeeRegistration {
  name: string;
  email: string;
  password: string;
  department: string;
  designation: string;
  role: "admin" | "employee" | "hr" | "manager";
  avatarUrl?: string;
}

export interface RegistrationCode {
  code: string;
  expiryDate: Date;
  isUsed: boolean;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  token?: string;
  newPassword?: string;
  confirmPassword?: string;
}
