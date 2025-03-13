
import { User, AttendanceRecord, LeaveRequest, PayrollRecord, OvertimeRecord, EmployeeRegistration, RegistrationCode } from "../models/types";
import { userService } from "./userService";
import { attendanceService } from "./attendanceService";
import { leaveService } from "./leaveService";
import { payrollService } from "./payrollService";
import { overtimeService } from "./overtimeService";
import { registrationService } from "./registrationService";

// Re-export all types
export type {
  User,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  OvertimeRecord,
  EmployeeRegistration,
  RegistrationCode
};

// Combine all services into a single API service for backward compatibility
export const apiService = {
  // User Service
  login: userService.login,
  logout: userService.logout,
  getUser: userService.getUser,
  getEmployeeById: userService.getEmployeeById,
  getAllEmployees: userService.getAllEmployees,
  registerEmployee: userService.registerEmployee,
  
  // Attendance Service
  getAllAttendance: attendanceService.getAllAttendance,
  getUserAttendance: attendanceService.getUserAttendance,
  createAttendanceRecord: attendanceService.createAttendanceRecord,
  updateAttendanceRecord: attendanceService.updateAttendanceRecord,
  deleteAttendanceRecord: attendanceService.deleteAttendanceRecord,
  checkIn: attendanceService.checkIn,
  checkOut: attendanceService.checkOut,
  adminOverrideCheckIn: attendanceService.adminOverrideCheckIn,
  adminOverrideCheckOut: attendanceService.adminOverrideCheckOut,
  
  // Leave Service
  getAllLeaveRequests: leaveService.getAllLeaveRequests,
  getUserLeaveRequests: leaveService.getUserLeaveRequests,
  createLeaveRequest: leaveService.createLeaveRequest,
  updateLeaveRequestStatus: leaveService.updateLeaveRequestStatus,
  
  // Payroll Service
  getAllPayroll: payrollService.getAllPayroll,
  getUserPayroll: payrollService.getUserPayroll,
  processPayroll: payrollService.processPayroll,
  markPayrollAsPaid: payrollService.markPayrollAsPaid,
  
  // Overtime Service
  getAllOvertime: overtimeService.getAllOvertime,
  getUserOvertime: overtimeService.getUserOvertime,
  createOvertimeRequest: overtimeService.createOvertimeRequest,
  updateOvertimeStatus: overtimeService.updateOvertimeStatus,
  submitOvertimeRequest: overtimeService.submitOvertimeRequest,
  
  // Registration Service
  createRegistrationCode: registrationService.createRegistrationCode,
  validateRegistrationCode: registrationService.validateRegistrationCode
};
