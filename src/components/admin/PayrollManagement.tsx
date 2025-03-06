
import { useState } from "react";
import { PayrollRecord, apiService, User } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowDownUp, BanknoteIcon, CalendarIcon, CheckCircle, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PayrollManagementProps {
  payrollRecords: PayrollRecord[];
  employees: User[];
  loading: boolean;
  onPayrollUpdate: () => void;
}

export default function PayrollManagement({ payrollRecords, employees, loading, onPayrollUpdate }: PayrollManagementProps) {
  const [processingPayroll, setProcessingPayroll] = useState(false);
  const [markingAsPaid, setMarkingAsPaid] = useState<number | null>(null);
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  
  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : "Unknown Employee";
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "processed":
        return <Badge className="bg-blue-500">Processed</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };
  
  const handleProcessPayroll = async (employeeId: number, month: string, year: number) => {
    try {
      setProcessingPayroll(true);
      await apiService.processPayroll(employeeId, month, year);
      toast.success("Payroll processed successfully");
      onPayrollUpdate();
    } catch (error) {
      console.error("Failed to process payroll", error);
      toast.error("Failed to process payroll");
    } finally {
      setProcessingPayroll(false);
    }
  };
  
  const handleMarkAsPaid = async (id: number) => {
    try {
      setMarkingAsPaid(id);
      await apiService.markPayrollAsPaid(id);
      toast.success("Payroll marked as paid");
      onPayrollUpdate();
    } catch (error) {
      console.error("Failed to mark payroll as paid", error);
      toast.error("Failed to mark payroll as paid");
    } finally {
      setMarkingAsPaid(null);
    }
  };
  
  // Get unique months, years, and statuses for filtering
  const months = Array.from(new Set(payrollRecords.map(record => record.month)));
  const years = Array.from(new Set(payrollRecords.map(record => record.year)));
  
  // Apply filters
  const filteredRecords = payrollRecords.filter(record => {
    if (filterMonth && record.month !== filterMonth) return false;
    if (filterYear && record.year !== parseInt(filterYear)) return false;
    if (filterStatus && record.status !== filterStatus) return false;
    return true;
  });
  
  // Months for processing new payroll
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payroll Management</h2>
          <p className="text-muted-foreground">Process and manage employee payrolls</p>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>
              <BanknoteIcon className="h-4 w-4 mr-2" /> Process New Payroll
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Process New Payroll</AlertDialogTitle>
              <AlertDialogDescription>
                Select an employee and the month to process their payroll. This will calculate salary, overtime, and deductions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Employee</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id.toString()}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Month</label>
                  <Select defaultValue={currentMonth}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="January">January</SelectItem>
                      <SelectItem value="February">February</SelectItem>
                      <SelectItem value="March">March</SelectItem>
                      <SelectItem value="April">April</SelectItem>
                      <SelectItem value="May">May</SelectItem>
                      <SelectItem value="June">June</SelectItem>
                      <SelectItem value="July">July</SelectItem>
                      <SelectItem value="August">August</SelectItem>
                      <SelectItem value="September">September</SelectItem>
                      <SelectItem value="October">October</SelectItem>
                      <SelectItem value="November">November</SelectItem>
                      <SelectItem value="December">December</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Select defaultValue={currentYear.toString()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
                      <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
                      <SelectItem value={(currentYear + 1).toString()}>{currentYear + 1}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleProcessPayroll(1, currentMonth, currentYear)}
                disabled={processingPayroll}
              >
                {processingPayroll ? "Processing..." : "Process Payroll"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base font-medium">Payroll Records</CardTitle>
              <CardDescription>View and manage all employee payrolls</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                setFilterMonth("");
                setFilterYear("");
                setFilterStatus("");
              }}>
                Clear Filters
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium mb-1 block">Month</label>
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Months</SelectItem>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium mb-1 block">Year</label>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Years</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Employee</TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-1">
                        <span>Period</span>
                        <ArrowDownUp size={14} />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Net Salary</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No payroll records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {getEmployeeName(record.employeeId)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            {record.month} {record.year}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(record.netSalary)}
                        </TableCell>
                        <TableCell className="text-right">
                          {getStatusBadge(record.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          {record.status === "processed" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsPaid(record.id)}
                              disabled={markingAsPaid === record.id}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {markingAsPaid === record.id ? "Processing..." : "Mark Paid"}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={record.status === "draft"}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
