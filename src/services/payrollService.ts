
import { PayrollRecord } from "../models/types";
import { userService } from "./userService";

export const payrollService = {
  async getAllPayroll(): Promise<PayrollRecord[]> {
    const storedPayroll = localStorage.getItem("mockPayrollData");
    return storedPayroll ? JSON.parse(storedPayroll) : [];
  },

  async getUserPayroll(userId: number): Promise<PayrollRecord[]> {
    const storedPayroll = localStorage.getItem("mockPayrollData");
    const payrollRecords: PayrollRecord[] = storedPayroll ? JSON.parse(storedPayroll) : [];
    return payrollRecords.filter(record => record.employeeId === userId);
  },
  
  async processPayroll(employeeId: number, month: string, year: number): Promise<PayrollRecord> {
    const employee = await userService.getEmployeeById(employeeId);
    if (!employee) {
      throw new Error("Employee not found");
    }
    
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
  }
};
