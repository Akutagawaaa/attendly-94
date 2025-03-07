
import { User } from "@/context/AuthContext";
import { formatDate, isSameDay } from "@/lib/utils";

// Mock attendance record interface
export interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string;
  checkIn: Date;
  checkOut: Date | null;
  modifiedBy?: number;
  modifiedAt?: Date;
  isAdminOverride?: boolean;
}

// Mock leave request interface
export interface LeaveRequest {
  id: number;
  employeeId: number;
  startDate: Date;
  endDate: Date;
  type: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

// Payroll related interfaces
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
  processedDate: Date | null;
  paymentDate: Date | null;
}

export interface OvertimeRecord {
  id: number;
  employeeId: number;
  date: string;
  hours: number;
  approvedBy: number | null;
  status: "pending" | "approved" | "rejected";
  reason: string;
  rate: number; // multiplier for overtime pay (e.g., 1.5x, 2x)
}

// Re-export the User type from AuthContext
export type { User };

// Mock API service
class ApiService {
  // Get the current user's attendance records
  async getUserAttendance(userId: number): Promise<AttendanceRecord[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Get mock data from localStorage or create new mock data
    const mockData = this.getMockAttendanceData();
    
    // Filter records for the specified user
    return mockData.filter((record) => record.employeeId === userId);
  }

  // Get all employee records (admin only)
  async getAllEmployees(): Promise<User[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Return mock employee data
    return [
      { id: 1, name: "Alex Johnson", email: "alex@example.com", role: "employee", department: "Engineering" },
      { id: 2, name: "Sarah Chen", email: "sarah@example.com", role: "employee", department: "Design" },
      { id: 3, name: "Michael Rodriguez", email: "michael@example.com", role: "employee", department: "Marketing" },
      { id: 4, name: "Emma Williams", email: "emma@example.com", role: "admin", department: "HR" },
      { id: 5, name: "David Kim", email: "david@example.com", role: "employee", department: "Engineering" },
    ];
  }

  // Get all attendance records (admin only)
  async getAllAttendance(): Promise<AttendanceRecord[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Return mock attendance data
    return this.getMockAttendanceData();
  }

  // Check-in a user
  async checkIn(userId: number): Promise<AttendanceRecord> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    const mockData = this.getMockAttendanceData();
    const today = new Date();
    const formattedDate = formatDate(today);
    
    // Check if already checked in today or has completed a check-in/out cycle
    const todayRecords = mockData.filter(
      (record) => record.employeeId === userId && 
                 isSameDay(new Date(record.date), today)
    );
    
    const hasCompletedCycle = todayRecords.some(record => record.checkOut !== null);
    const hasActiveCheckIn = todayRecords.some(record => record.checkOut === null);
    
    if (hasCompletedCycle) {
      throw new Error("You have already completed your check-in/out cycle for today");
    }
    
    if (hasActiveCheckIn) {
      throw new Error("You have already checked in today");
    }
    
    // Create new check-in record
    const newRecord: AttendanceRecord = {
      id: mockData.length + 1,
      employeeId: userId,
      date: formattedDate,
      checkIn: new Date(),
      checkOut: null,
    };
    
    mockData.push(newRecord);
    localStorage.setItem("mockAttendanceData", JSON.stringify(mockData));
    
    return newRecord;
  }

  // Check-out a user
  async checkOut(userId: number): Promise<AttendanceRecord> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    const mockData = this.getMockAttendanceData();
    const today = new Date();
    const formattedDate = formatDate(today);
    
    // Find today's check-in record that hasn't been checked out
    const existingRecord = mockData.find(
      (record) => 
        record.employeeId === userId && 
        isSameDay(new Date(record.date), today) && 
        !record.checkOut
    );
    
    if (!existingRecord) {
      throw new Error("You haven't checked in yet today");
    }
    
    // Update the record with check-out time
    existingRecord.checkOut = new Date();
    localStorage.setItem("mockAttendanceData", JSON.stringify(mockData));
    
    return existingRecord;
  }

  // Admin override check-in time
  async adminOverrideCheckIn(employeeId: number, checkInTime: Date, adminId: number): Promise<AttendanceRecord> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockData = this.getMockAttendanceData();
    const formattedDate = formatDate(checkInTime);
    
    // Check if there's already a record for this date
    const existingRecords = mockData.filter(
      (record) => 
        record.employeeId === employeeId && 
        isSameDay(new Date(record.date), checkInTime)
    );
    
    if (existingRecords.length > 0) {
      // Update existing record
      const record = existingRecords[0];
      record.checkIn = checkInTime;
      record.modifiedBy = adminId;
      record.modifiedAt = new Date();
      record.isAdminOverride = true;
      
      localStorage.setItem("mockAttendanceData", JSON.stringify(mockData));
      return record;
    }
    
    // Create new record
    const newRecord: AttendanceRecord = {
      id: mockData.length + 1,
      employeeId,
      date: formattedDate,
      checkIn: checkInTime,
      checkOut: null,
      modifiedBy: adminId,
      modifiedAt: new Date(),
      isAdminOverride: true
    };
    
    mockData.push(newRecord);
    localStorage.setItem("mockAttendanceData", JSON.stringify(mockData));
    
    return newRecord;
  }

  // Admin override check-out time
  async adminOverrideCheckOut(employeeId: number, checkOutTime: Date, adminId: number): Promise<AttendanceRecord> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockData = this.getMockAttendanceData();
    
    // Find most recent check-in for this employee that doesn't have a check-out
    const existingRecords = mockData.filter(
      (record) => 
        record.employeeId === employeeId && 
        isSameDay(new Date(record.date), checkOutTime)
    );
    
    if (existingRecords.length === 0) {
      throw new Error("No check-in record found for this employee on the selected date");
    }
    
    const record = existingRecords[0];
    
    // Update record with check-out time
    record.checkOut = checkOutTime;
    record.modifiedBy = adminId;
    record.modifiedAt = new Date();
    record.isAdminOverride = true;
    
    localStorage.setItem("mockAttendanceData", JSON.stringify(mockData));
    
    return record;
  }

  // Create a leave request
  async createLeaveRequest(leaveRequest: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>): Promise<LeaveRequest> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const leaveRequests = this.getMockLeaveRequests();
    
    const newRequest: LeaveRequest = {
      id: leaveRequests.length + 1,
      ...leaveRequest,
      status: "pending",
      createdAt: new Date(),
    };
    
    leaveRequests.push(newRequest);
    localStorage.setItem("mockLeaveRequests", JSON.stringify(leaveRequests));
    
    return newRequest;
  }

  // Get user leave requests
  async getUserLeaveRequests(userId: number): Promise<LeaveRequest[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    const leaveRequests = this.getMockLeaveRequests();
    
    // Filter by user ID
    return leaveRequests
      .filter(request => request.employeeId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Get all leave requests (admin only)
  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    return this.getMockLeaveRequests()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Update leave request status (admin only)
  async updateLeaveRequestStatus(id: number, status: "approved" | "rejected"): Promise<LeaveRequest> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const leaveRequests = this.getMockLeaveRequests();
    
    const request = leaveRequests.find(req => req.id === id);
    if (!request) {
      throw new Error("Leave request not found");
    }
    
    // Update status
    request.status = status;
    localStorage.setItem("mockLeaveRequests", JSON.stringify(leaveRequests));
    
    return request;
  }

  // Get payroll records for a specific employee
  async getUserPayroll(userId: number): Promise<PayrollRecord[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    return this.getMockPayrollData().filter(
      record => record.employeeId === userId
    ).sort((a, b) => {
      // Sort by year and month (most recent first)
      if (a.year !== b.year) return b.year - a.year;
      return new Date(`${b.month} 1, ${b.year}`).getTime() - new Date(`${a.month} 1, ${a.year}`).getTime();
    });
  }

  // Get all payroll records (admin only)
  async getAllPayroll(): Promise<PayrollRecord[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    return this.getMockPayrollData().sort((a, b) => {
      // Sort by year and month (most recent first)
      if (a.year !== b.year) return b.year - a.year;
      return new Date(`${b.month} 1, ${b.year}`).getTime() - new Date(`${a.month} 1, ${a.year}`).getTime();
    });
  }

  // Get overtime records for a specific employee
  async getUserOvertime(userId: number): Promise<OvertimeRecord[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    return this.getMockOvertimeData().filter(
      record => record.employeeId === userId
    ).sort((a, b) => {
      // Sort by date (most recent first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  // Get all overtime records (admin only)
  async getAllOvertime(): Promise<OvertimeRecord[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    return this.getMockOvertimeData().sort((a, b) => {
      // Sort by date (most recent first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  // Submit a new overtime request
  async submitOvertimeRequest(overtimeRequest: Omit<OvertimeRecord, 'id' | 'status' | 'approvedBy'>): Promise<OvertimeRecord> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const overtimeRecords = this.getMockOvertimeData();
    
    const newRequest: OvertimeRecord = {
      id: overtimeRecords.length + 1,
      ...overtimeRequest,
      status: "pending",
      approvedBy: null
    };
    
    overtimeRecords.push(newRequest);
    localStorage.setItem("mockOvertimeData", JSON.stringify(overtimeRecords));
    
    return newRequest;
  }

  // Update overtime request status (admin only)
  async updateOvertimeStatus(id: number, status: "approved" | "rejected", approvedBy: number): Promise<OvertimeRecord> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const overtimeRecords = this.getMockOvertimeData();
    
    const request = overtimeRecords.find(req => req.id === id);
    if (!request) {
      throw new Error("Overtime request not found");
    }
    
    // Update status and approver
    request.status = status;
    request.approvedBy = approvedBy;
    localStorage.setItem("mockOvertimeData", JSON.stringify(overtimeRecords));
    
    return request;
  }

  // Calculate and process payroll for an employee (admin only)
  async processPayroll(employeeId: number, month: string, year: number): Promise<PayrollRecord> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const payrollRecords = this.getMockPayrollData();
    
    // Check if a payroll record already exists for this month/year/employee
    const existingRecord = payrollRecords.find(
      record => record.employeeId === employeeId && record.month === month && record.year === year
    );
    
    if (existingRecord) {
      // Update existing record
      existingRecord.status = "processed";
      existingRecord.processedDate = new Date();
      localStorage.setItem("mockPayrollData", JSON.stringify(payrollRecords));
      return existingRecord;
    }
    
    // Get employee overtime records for the month
    const overtimeRecords = this.getMockOvertimeData().filter(
      record => {
        const recordDate = new Date(record.date);
        return record.employeeId === employeeId && 
               record.status === "approved" &&
               recordDate.getMonth() === new Date(`${month} 1`).getMonth() &&
               recordDate.getFullYear() === year;
      }
    );
    
    // Calculate overtime pay
    const overtimeHours = overtimeRecords.reduce((total, record) => total + record.hours, 0);
    const overtimePay = overtimeHours * 25 * this.getAverageOvertimeRate(overtimeRecords); // Assuming $25/hour base rate
    
    // Create new payroll record with mock data
    const baseSalary = this.getEmployeeBaseSalary(employeeId);
    const bonus = Math.random() < 0.3 ? Math.round(baseSalary * 0.05) : 0; // Random bonus for some employees
    const deductions = Math.round(baseSalary * 0.2); // Tax and other deductions
    
    const newRecord: PayrollRecord = {
      id: payrollRecords.length + 1,
      employeeId,
      month,
      year,
      baseSalary,
      overtimePay,
      bonus,
      deductions,
      netSalary: baseSalary + overtimePay + bonus - deductions,
      status: "processed",
      processedDate: new Date(),
      paymentDate: null
    };
    
    payrollRecords.push(newRecord);
    localStorage.setItem("mockPayrollData", JSON.stringify(payrollRecords));
    
    return newRecord;
  }

  // Mark payroll as paid (admin only)
  async markPayrollAsPaid(payrollId: number): Promise<PayrollRecord> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const payrollRecords = this.getMockPayrollData();
    
    const record = payrollRecords.find(rec => rec.id === payrollId);
    if (!record) {
      throw new Error("Payroll record not found");
    }
    
    record.status = "paid";
    record.paymentDate = new Date();
    localStorage.setItem("mockPayrollData", JSON.stringify(payrollRecords));
    
    return record;
  }

  // Private helper methods
  private getEmployeeBaseSalary(employeeId: number): number {
    // Mock base salaries based on employee ID
    const baseSalaries: Record<number, number> = {
      1: 5000, // Alex Johnson
      2: 5500, // Sarah Chen
      3: 4800, // Michael Rodriguez
      4: 6200, // Emma Williams
      5: 5200  // David Kim
    };
    
    return baseSalaries[employeeId] || 5000; // Default to 5000 if not found
  }
  
  private getAverageOvertimeRate(overtimeRecords: OvertimeRecord[]): number {
    if (overtimeRecords.length === 0) return 1.5; // Default overtime rate
    
    const totalRate = overtimeRecords.reduce((sum, record) => sum + record.rate, 0);
    return totalRate / overtimeRecords.length;
  }

  // Private helper to get or initialize mock data
  private getMockAttendanceData(): AttendanceRecord[] {
    const storedData = localStorage.getItem("mockAttendanceData");
    
    if (storedData) {
      // Parse stored data and convert date strings back to Date objects
      const parsedData = JSON.parse(storedData);
      return parsedData.map((record: any) => ({
        ...record,
        checkIn: new Date(record.checkIn),
        checkOut: record.checkOut ? new Date(record.checkOut) : null,
        modifiedAt: record.modifiedAt ? new Date(record.modifiedAt) : undefined,
      }));
    }
    
    // Create initial mock data
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const mockData: AttendanceRecord[] = [
      {
        id: 1,
        employeeId: 1,
        date: formatDate(today),
        checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
        checkOut: null,
      },
      {
        id: 2,
        employeeId: 2,
        date: formatDate(today),
        checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 45),
        checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 30),
      },
      {
        id: 3,
        employeeId: 1,
        date: formatDate(yesterday),
        checkIn: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 9, 15),
        checkOut: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 18, 0),
      },
    ];
    
    localStorage.setItem("mockAttendanceData", JSON.stringify(mockData));
    return mockData;
  }

  // Private helper to get or initialize mock leave requests
  private getMockLeaveRequests(): LeaveRequest[] {
    const storedData = localStorage.getItem("mockLeaveRequests");
    
    if (storedData) {
      // Parse stored data and convert date strings back to Date objects
      const parsedData = JSON.parse(storedData);
      return parsedData.map((request: any) => ({
        ...request,
        startDate: new Date(request.startDate),
        endDate: new Date(request.endDate),
        createdAt: new Date(request.createdAt),
      }));
    }
    
    // Create initial mock data
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const mockData: LeaveRequest[] = [
      {
        id: 1,
        employeeId: 1,
        startDate: nextWeek,
        endDate: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 2),
        type: "annual",
        reason: "Family vacation",
        status: "pending",
        createdAt: yesterday,
      },
      {
        id: 2,
        employeeId: 1,
        startDate: threeDaysAgo,
        endDate: yesterday,
        type: "sick",
        reason: "Caught a cold",
        status: "approved",
        createdAt: new Date(threeDaysAgo.getFullYear(), threeDaysAgo.getMonth(), threeDaysAgo.getDate() - 1),
      },
      {
        id: 3,
        employeeId: 2,
        startDate: today,
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        type: "family",
        reason: "Family emergency",
        status: "approved",
        createdAt: yesterday,
      },
    ];
    
    localStorage.setItem("mockLeaveRequests", JSON.stringify(mockData));
    return mockData;
  }

  // Private helper to get or initialize mock payroll data
  private getMockPayrollData(): PayrollRecord[] {
    const storedData = localStorage.getItem("mockPayrollData");
    
    if (storedData) {
      // Parse stored data and convert date strings back to Date objects
      const parsedData = JSON.parse(storedData);
      return parsedData.map((record: any) => ({
        ...record,
        processedDate: record.processedDate ? new Date(record.processedDate) : null,
        paymentDate: record.paymentDate ? new Date(record.paymentDate) : null,
      }));
    }
    
    // Create initial mock data
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1).toLocaleString('default', { month: 'long' });
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1).toLocaleString('default', { month: 'long' });
    
    const mockData: PayrollRecord[] = [
      {
        id: 1,
        employeeId: 1,
        month: lastMonth,
        year: today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear(),
        baseSalary: 5000,
        overtimePay: 350,
        bonus: 250,
        deductions: 1000,
        netSalary: 4600,
        status: "paid",
        processedDate: new Date(today.getFullYear(), today.getMonth() - 1, 25),
        paymentDate: new Date(today.getFullYear(), today.getMonth() - 1, 28),
      },
      {
        id: 2,
        employeeId: 2,
        month: lastMonth,
        year: today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear(),
        baseSalary: 5500,
        overtimePay: 0,
        bonus: 0,
        deductions: 1100,
        netSalary: 4400,
        status: "paid",
        processedDate: new Date(today.getFullYear(), today.getMonth() - 1, 25),
        paymentDate: new Date(today.getFullYear(), today.getMonth() - 1, 28),
      },
      {
        id: 3,
        employeeId: 1,
        month: twoMonthsAgo,
        year: today.getMonth() <= 1 ? today.getFullYear() - 1 : today.getFullYear(),
        baseSalary: 5000,
        overtimePay: 200,
        bonus: 0,
        deductions: 1000,
        netSalary: 4200,
        status: "paid",
        processedDate: new Date(today.getFullYear(), today.getMonth() - 2, 26),
        paymentDate: new Date(today.getFullYear(), today.getMonth() - 2, 30),
      },
      {
        id: 4,
        employeeId: 1,
        month: currentMonth,
        year: today.getFullYear(),
        baseSalary: 5000,
        overtimePay: 0,
        bonus: 0,
        deductions: 1000,
        netSalary: 4000,
        status: "draft",
        processedDate: null,
        paymentDate: null,
      },
    ];
    
    localStorage.setItem("mockPayrollData", JSON.stringify(mockData));
    return mockData;
  }

  // Private helper to get or initialize mock overtime data
  private getMockOvertimeData(): OvertimeRecord[] {
    const storedData = localStorage.getItem("mockOvertimeData");
    
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    // Create initial mock data
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    const mockData: OvertimeRecord[] = [
      {
        id: 1,
        employeeId: 1,
        date: lastWeek.toISOString().split('T')[0],
        hours: 2.5,
        approvedBy: 4,
        status: "approved",
        reason: "Urgent client project deadline",
        rate: 1.5
      },
      {
        id: 2,
        employeeId: 1,
        date: yesterday.toISOString().split('T')[0],
        hours: 1.0,
        approvedBy: null,
        status: "pending",
        reason: "System maintenance after hours",
        rate: 1.5
      },
      {
        id: 3,
        employeeId: 2,
        date: threeDaysAgo.toISOString().split('T')[0],
        hours: 3.0,
        approvedBy: 4,
        status: "approved",
        reason: "Emergency design changes for product launch",
        rate: 1.5
      },
      {
        id: 4,
        employeeId: 5,
        date: today.toISOString().split('T')[0],
        hours: 2.0,
        approvedBy: null,
        status: "pending",
        reason: "Critical bug fix implementation",
        rate: 2.0
      },
    ];
    
    localStorage.setItem("mockOvertimeData", JSON.stringify(mockData));
    return mockData;
  }
}

export const apiService = new ApiService();
