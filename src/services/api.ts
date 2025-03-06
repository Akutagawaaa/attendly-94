import { User } from "@/context/AuthContext";

// Mock attendance record interface
export interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string;
  checkIn: Date;
  checkOut: Date | null;
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
    const formattedDate = today.toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    // Check if already checked in today
    const existingRecord = mockData.find(
      (record) => record.employeeId === userId && record.date === formattedDate && !record.checkOut
    );
    
    if (existingRecord) {
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
    
    // Add to mock data
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
    const formattedDate = today.toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    // Find today's check-in record
    const existingRecord = mockData.find(
      (record) => record.employeeId === userId && record.date === formattedDate && !record.checkOut
    );
    
    if (!existingRecord) {
      throw new Error("You haven't checked in yet today");
    }
    
    // Update the record with check-out time
    existingRecord.checkOut = new Date();
    localStorage.setItem("mockAttendanceData", JSON.stringify(mockData));
    
    return existingRecord;
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
        date: today.toLocaleDateString([], {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
        checkOut: null,
      },
      {
        id: 2,
        employeeId: 2,
        date: today.toLocaleDateString([], {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 45),
        checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 30),
      },
      {
        id: 3,
        employeeId: 1,
        date: yesterday.toLocaleDateString([], {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
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
}

export const apiService = new ApiService();
