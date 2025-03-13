
import { PayrollRecord } from "../models/types";
import { db } from "../config/db";
import { toast } from "sonner";

export const payrollService = {
  async getAllPayroll(): Promise<PayrollRecord[]> {
    try {
      const result = await db.query(`
        SELECT * FROM payroll
        ORDER BY year DESC, month DESC
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        employeeId: row.employee_id,
        month: row.month,
        year: row.year,
        baseSalary: row.base_salary,
        overtimePay: row.overtime_pay,
        bonus: row.bonus,
        deductions: row.deductions,
        netSalary: row.net_salary,
        status: row.status as "draft" | "processed" | "paid",
        processedDate: row.processed_date,
        paymentDate: row.payment_date
      }));
    } catch (error) {
      console.error("Error fetching payroll records:", error);
      toast.error("Failed to fetch payroll records");
      return [];
    }
  },

  async getUserPayroll(userId: number): Promise<PayrollRecord[]> {
    try {
      const result = await db.query(`
        SELECT * FROM payroll
        WHERE employee_id = $1
        ORDER BY year DESC, month DESC
      `, [userId]);
      
      return result.rows.map(row => ({
        id: row.id,
        employeeId: row.employee_id,
        month: row.month,
        year: row.year,
        baseSalary: row.base_salary,
        overtimePay: row.overtime_pay,
        bonus: row.bonus,
        deductions: row.deductions,
        netSalary: row.net_salary,
        status: row.status as "draft" | "processed" | "paid",
        processedDate: row.processed_date,
        paymentDate: row.payment_date
      }));
    } catch (error) {
      console.error("Error fetching user payroll records:", error);
      toast.error("Failed to fetch your payroll records");
      return [];
    }
  },
  
  async processPayroll(employeeId: number, month: string, year: number): Promise<PayrollRecord> {
    try {
      // Get employee information
      const employeeResult = await db.query(
        "SELECT * FROM users WHERE id = $1",
        [employeeId]
      );
      
      if (employeeResult.rows.length === 0) {
        throw new Error("Employee not found");
      }
      
      // Calculate overtime
      const overtimeResult = await db.query(
        `SELECT SUM(hours * rate) as total_overtime
         FROM overtime
         WHERE employee_id = $1 AND 
               EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM TO_DATE($2, 'MM/YYYY')) AND
               EXTRACT(YEAR FROM date) = $3 AND
               status = 'approved'`,
        [employeeId, month, year]
      );
      
      const overtimePay = parseFloat(overtimeResult.rows[0]?.total_overtime || "0");
      
      // For demo, we're using fixed values for some fields
      const baseSalary = 5000;
      const bonus = 100;
      const deductions = 200;
      const netSalary = baseSalary + overtimePay + bonus - deductions;
      
      // Insert payroll record
      const result = await db.query(`
        INSERT INTO payroll (
          employee_id, month, year, base_salary, overtime_pay, 
          bonus, deductions, net_salary, status, processed_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        employeeId,
        month,
        year,
        baseSalary,
        overtimePay,
        bonus,
        deductions,
        netSalary,
        "processed",
        new Date()
      ]);
      
      const row = result.rows[0];
      
      return {
        id: row.id,
        employeeId: row.employee_id,
        month: row.month,
        year: row.year,
        baseSalary: row.base_salary,
        overtimePay: row.overtime_pay,
        bonus: row.bonus,
        deductions: row.deductions,
        netSalary: row.net_salary,
        status: row.status as "draft" | "processed" | "paid",
        processedDate: row.processed_date,
        paymentDate: row.payment_date
      };
    } catch (error) {
      console.error("Error processing payroll:", error);
      toast.error("Failed to process payroll");
      throw new Error("Failed to process payroll");
    }
  },
  
  async markPayrollAsPaid(id: number): Promise<PayrollRecord | null> {
    try {
      const result = await db.query(`
        UPDATE payroll
        SET status = 'paid', payment_date = $1
        WHERE id = $2
        RETURNING *
      `, [new Date(), id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      
      return {
        id: row.id,
        employeeId: row.employee_id,
        month: row.month,
        year: row.year,
        baseSalary: row.base_salary,
        overtimePay: row.overtime_pay,
        bonus: row.bonus,
        deductions: row.deductions,
        netSalary: row.net_salary,
        status: row.status as "draft" | "processed" | "paid",
        processedDate: row.processed_date,
        paymentDate: row.payment_date
      };
    } catch (error) {
      console.error("Error marking payroll as paid:", error);
      toast.error("Failed to mark payroll as paid");
      return null;
    }
  }
};
