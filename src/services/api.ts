import { formatDate } from "@/lib/utils";

export interface User {
  id: number;
  name: string;
  email?: string;
  password?: string;
  role: "admin" | "employee";
  department: string;
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

// Add types for employee registration
export interface EmployeeRegistration {
  name: string;
  email: string;
  password: string;
  department: string;
  role: "admin" | "employee";
}

export interface RegistrationCode {
  code: string;
  expiryDate: Date;
  isUsed: boolean;
}

export const apiService = {
  async login(email: string, password: string): Promise<User | null> {
    const storedUsers = localStorage.getItem("mockUsers");
    if (!storedUsers) return null;
    
    const users: User[] = JSON.parse(storedUsers);
    const user = users.find(user => user.email === email && user.password === password);
    
    return user || null;
  },
  
  async logout(): Promise<void> {
    // In a real app, you might clear tokens or session data here
    return Promise.resolve();
  },
  
  async getUser(id: number): Promise<User | null> {
    const storedUsers = localStorage.getItem("mockUsers");
    if (!storedUsers) return null;
    
    const users: User[] = JSON.parse(storedUsers);
    const user = users.find(user => user.id === id);
    
    return user || null;
  },
  
  async getEmployeeById(id: number): Promise<User | null> {
    const storedUsers = localStorage.getItem("mockUsers");
    if (!storedUsers) return null;
    
    const users: User[] = JSON.parse(storedUsers);
    const employee = users.find(user => user.id === id);
    
    return employee || null;
  },
  
  async getAllEmployees(): Promise<User[]> {
    const storedUsers = localStorage.getItem("mockUsers");
    return storedUsers ? JSON.parse(storedUsers) : [];
  },
  
  async getAllAttendance(): Promise<AttendanceRecord[]> {
    const storedAttendance = localStorage.getItem("mockAttendanceData");
    return storedAttendance ? JSON.parse(storedAttendance) : [];
  },
  
  async createAttendanceRecord(record: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
    const storedAttendance = localStorage.getItem("mockAttendanceData");
    const attendanceRecords: AttendanceRecord[] = storedAttendance ? JSON.parse(storedAttendance) : [];
    
    const newRecord: AttendanceRecord = {
      id: Math.floor(Math.random() * 10000),
      ...record,
    };
    
    attendanceRecords.push(newRecord);
    localStorage.setItem("mockAttendanceData", JSON.stringify(attendanceRecords));
    return newRecord;
  },
  
  async updateAttendanceRecord(id: number, updates: Partial<AttendanceRecord>): Promise<AttendanceRecord | null> {
    const storedAttendance = localStorage.getItem("mockAttendanceData");
    if (!storedAttendance) return null;
    
    let attendanceRecords: AttendanceRecord[] = JSON.parse(storedAttendance);
    const recordIndex = attendanceRecords.findIndex(record => record.id === id);
    
    if (recordIndex === -1) return null;
    
    attendanceRecords[recordIndex] = {
      ...attendanceRecords[recordIndex],
      ...updates,
    };
    
    localStorage.setItem("mockAttendanceData", JSON.stringify(attendanceRecords));
    return attendanceRecords[recordIndex];
  },
  
  async deleteAttendanceRecord(id: number): Promise<boolean> {
    const storedAttendance = localStorage.getItem("mockAttendanceData");
    if (!storedAttendance) return false;
    
    let attendanceRecords: AttendanceRecord[] = JSON.parse(storedAttendance);
    const initialLength = attendanceRecords.length;
    attendanceRecords = attendanceRecords.filter(record => record.id !== id);
    
    if (attendanceRecords.length === initialLength) return false;
    
    localStorage.setItem("mockAttendanceData", JSON.stringify(attendanceRecords));
    return true;
  },
  
  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    const storedRequests = localStorage.getItem("mockLeaveRequests");
    return storedRequests ? JSON.parse(storedRequests) : [];
  },
  
  async createLeaveRequest(request: Omit<LeaveRequest, 'id' | 'status'>, employeeId: number): Promise<LeaveRequest> {
    const storedRequests = localStorage.getItem("mockLeaveRequests");
    const leaveRequests: LeaveRequest[] = storedRequests ? JSON.parse(storedRequests) : [];
    
    const newRequest: LeaveRequest = {
      id: Math.floor(Math.random() * 10000),
      employeeId,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason,
      status: "pending",
    };
    
    leaveRequests.push(newRequest);
    localStorage.setItem("mockLeaveRequests", JSON.stringify(leaveRequests));
    return newRequest;
  },
  
  async updateLeaveRequestStatus(id: number, status: "approved" | "rejected"): Promise<LeaveRequest | null> {
    const storedRequests = localStorage.getItem("mockLeaveRequests");
    if (!storedRequests) return null;
    
    let leaveRequests: LeaveRequest[] = JSON.parse(storedRequests);
    const requestIndex = leaveRequests.findIndex(request => request.id === id);
    
    if (requestIndex === -1) return null;
    
    leaveRequests[requestIndex] = {
      ...leaveRequests[requestIndex],
      status,
    };
    
    localStorage.setItem("mockLeaveRequests", JSON.stringify(leaveRequests));
    return leaveRequests[requestIndex];
  },
  
  async getAllPayroll(): Promise<PayrollRecord[]> {
    const storedPayroll = localStorage.getItem("mockPayrollData");
    return storedPayroll ? JSON.parse(storedPayroll) : [];
  },
  
  async processPayroll(employeeId: number, month: string, year: number): Promise<PayrollRecord> {
    // Fetch employee data
    const employee = await this.getEmployeeById(employeeId);
    if (!employee) {
      throw new Error("Employee not found");
    }
    
    // Mock calculation
    const baseSalary = 5000;
    const overtimePay = 500;
    const bonus = 100;
    const deductions = 200;
    const netSalary = baseSalary + overtimePay + bonus - deductions;
    
    const newPayroll: PayrollRecord = {
      id: Math.floor(Math.random() * 10000),
      employeeId,
      month,
      year,
      baseSalary,
      overtimePay,
      bonus,
      deductions,
      netSalary,
      status: "processed",
      processedDate: new Date().toISOString(),
    };
    
    // Save to localStorage
    const storedPayroll = localStorage.getItem("mockPayrollData");
    const payrollData: PayrollRecord[] = storedPayroll ? JSON.parse(storedPayroll) : [];
    payrollData.push(newPayroll);
    localStorage.setItem("mockPayrollData", JSON.stringify(payrollData));
    
    return newPayroll;
  },
  
  async markPayrollAsPaid(id: number): Promise<PayrollRecord | null> {
    const storedPayroll = localStorage.getItem("mockPayrollData");
    if (!storedPayroll) return null;
    
    let payrollRecords: PayrollRecord[] = JSON.parse(storedPayroll);
    const recordIndex = payrollRecords.findIndex(record => record.id === id);
    
    if (recordIndex === -1) return null;
    
    payrollRecords[recordIndex] = {
      ...payrollRecords[recordIndex],
      status: "paid",
      paymentDate: new Date().toISOString(),
    };
    
    localStorage.setItem("mockPayrollData", JSON.stringify(payrollRecords));
    return payrollRecords[recordIndex];
  },
  
  async getAllOvertime(): Promise<OvertimeRecord[]> {
    const storedOvertime = localStorage.getItem("mockOvertimeData");
    return storedOvertime ? JSON.parse(storedOvertime) : [];
  },
  
  async createOvertimeRequest(request: Omit<OvertimeRecord, 'id' | 'status' | 'approvedBy'>, employeeId: number): Promise<OvertimeRecord> {
    const storedOvertime = localStorage.getItem("mockOvertimeData");
    const overtimeRecords: OvertimeRecord[] = storedOvertime ? JSON.parse(storedOvertime) : [];
    
    const newOvertime: OvertimeRecord = {
      id: Math.floor(Math.random() * 10000),
      employeeId,
      date: request.date,
      hours: request.hours,
      rate: request.rate,
      reason: request.reason,
      status: "pending",
    };
    
    overtimeRecords.push(newOvertime);
    localStorage.setItem("mockOvertimeData", JSON.stringify(overtimeRecords));
    return newOvertime;
  },
  
  async updateOvertimeStatus(id: number, status: "approved" | "rejected", approvedBy: number): Promise<OvertimeRecord | null> {
    const storedOvertime = localStorage.getItem("mockOvertimeData");
    if (!storedOvertime) return null;
    
    let overtimeRecords: OvertimeRecord[] = JSON.parse(storedOvertime);
    const recordIndex = overtimeRecords.findIndex(record => record.id === id);
    
    if (recordIndex === -1) return null;
    
    overtimeRecords[recordIndex] = {
      ...overtimeRecords[recordIndex],
      status,
      approvedBy,
    };
    
    localStorage.setItem("mockOvertimeData", JSON.stringify(overtimeRecords));
    return overtimeRecords[recordIndex];
  },

  async adminOverrideCheckIn(employeeId: number, checkInTime: Date, adminId: number): Promise<AttendanceRecord | null> {
    const today = formatDate(new Date());
    
    // Get existing attendance records for the day
    const attendanceRecords = await this.getAllAttendance();
    const existingRecord = attendanceRecords.find(
      record => 
        record.employeeId === employeeId && 
        record.date === today
    );
    
    if (existingRecord) {
      // Update existing record
      existingRecord.checkIn = checkInTime.toISOString();
      await this.updateAttendanceRecord(existingRecord.id, existingRecord);
      return existingRecord;
    } else {
      // Create a new record
      const newRecord: AttendanceRecord = {
        id: Math.floor(Math.random() * 10000),
        employeeId: employeeId,
        date: today,
        checkIn: checkInTime.toISOString(),
        checkOut: null,
      };
      
      attendanceRecords.push(newRecord);
      localStorage.setItem("mockAttendanceData", JSON.stringify(attendanceRecords));
      return newRecord;
    }
  },
  
  async adminOverrideCheckOut(employeeId: number, checkOutTime: Date, adminId: number): Promise<AttendanceRecord | null> {
    const today = formatDate(new Date());
    
    // Get existing attendance records for the day
    const attendanceRecords = await this.getAllAttendance();
    const existingRecord = attendanceRecords.find(
      record => 
        record.employeeId === employeeId && 
        record.date === today
    );
    
    if (existingRecord) {
      // Update existing record
      existingRecord.checkOut = checkOutTime.toISOString();
      await this.updateAttendanceRecord(existingRecord.id, existingRecord);
      return existingRecord;
    } else {
      // Create a new record
      const newRecord: AttendanceRecord = {
        id: Math.floor(Math.random() * 10000),
        employeeId: employeeId,
        date: today,
        checkIn: null,
        checkOut: checkOutTime.toISOString(),
      };
      
      attendanceRecords.push(newRecord);
      localStorage.setItem("mockAttendanceData", JSON.stringify(attendanceRecords));
      return newRecord;
    }
  },
  // Employee Registration
  async registerEmployee(data: EmployeeRegistration): Promise<User> {
    // In a real app, this would make an API call to register the employee
    console.log("Registering employee:", data);
    
    // For our mock implementation, save to localStorage
    const storedUsers = localStorage.getItem("mockUsers");
    let users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if email already exists
    const emailExists = users.some((user: any) => user.email === data.email);
    if (emailExists) {
      throw new Error("Email already registered");
    }
    
    // Create new user
    const newUser: User = {
      id: Math.floor(Math.random() * 10000) + 10, // Ensure it doesn't conflict with existing IDs
      name: data.name,
      email: data.email,
      password: data.password, // In a real app, this would be hashed
      role: data.role,
      department: data.department,
    };
    
    users.push(newUser);
    localStorage.setItem("mockUsers", JSON.stringify(users));
    
    return newUser;
  },
  
  // Registration Codes
  async createRegistrationCode(code: string, expiryDays: number): Promise<RegistrationCode> {
    // Set expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    const registrationCode: RegistrationCode = {
      code,
      expiryDate,
      isUsed: false
    };
    
    // Store in localStorage for our mock implementation
    const storedCodes = localStorage.getItem("mockRegistrationCodes");
    const codes = storedCodes ? JSON.parse(storedCodes) : [];
    codes.push(registrationCode);
    localStorage.setItem("mockRegistrationCodes", JSON.stringify(codes));
    
    return registrationCode;
  },
  
  async validateRegistrationCode(code: string): Promise<boolean> {
    // Get codes from localStorage
    const storedCodes = localStorage.getItem("mockRegistrationCodes");
    if (!storedCodes) return false;
    
    const codes: RegistrationCode[] = JSON.parse(storedCodes);
    const registrationCode = codes.find(c => c.code === code);
    
    // Check if code exists, is not used, and has not expired
    if (!registrationCode) return false;
    if (registrationCode.isUsed) return false;
    
    const expiryDate = new Date(registrationCode.expiryDate);
    if (expiryDate < new Date()) return false;
    
    // Mark code as used
    registrationCode.isUsed = true;
    localStorage.setItem("mockRegistrationCodes", JSON.stringify(codes));
    
    return true;
  },
};
