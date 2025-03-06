
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PayrollRecord } from "@/services/api";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BanknoteIcon, FileTextIcon, DownloadIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PayrollSummaryProps {
  payrollRecords: PayrollRecord[];
  loading: boolean;
}

export default function PayrollSummary({ payrollRecords, loading }: PayrollSummaryProps) {
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  
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
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const handleViewPayslip = (record: PayrollRecord) => {
    setSelectedRecord(record);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Payroll Summary</CardTitle>
        <CardDescription>View your payroll history and payment status</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : payrollRecords.length === 0 ? (
          <div className="text-center py-8 space-y-3 text-muted-foreground">
            <BanknoteIcon className="h-12 w-12 mx-auto opacity-20" />
            <p>No payroll records available.</p>
            <p className="text-sm">Your payroll information will appear here once processed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payrollRecords.map((record) => (
              <div key={record.id} className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {record.month} {record.year}
                    </p>
                    <p className="text-xl font-semibold mt-1">
                      {formatCurrency(record.netSalary)}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(record.status)}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleViewPayslip(record)}
                        >
                          <FileTextIcon className="h-3.5 w-3.5 mr-1" /> View Payslip
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Payslip: {record.month} {record.year}</DialogTitle>
                          <DialogDescription>
                            Payment Status: {record.status}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="flex justify-between py-1 border-b">
                            <span className="text-muted-foreground">Status</span>
                            <span>{getStatusBadge(record.status)}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <span className="text-muted-foreground">Base Salary</span>
                            <span>{formatCurrency(record.baseSalary)}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <span className="text-muted-foreground">Overtime Pay</span>
                            <span>{formatCurrency(record.overtimePay)}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <span className="text-muted-foreground">Bonus</span>
                            <span>{formatCurrency(record.bonus)}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <span className="text-muted-foreground">Deductions</span>
                            <span>-{formatCurrency(record.deductions)}</span>
                          </div>
                          <div className="flex justify-between py-1 font-bold text-lg">
                            <span>Net Salary</span>
                            <span>{formatCurrency(record.netSalary)}</span>
                          </div>
                          {record.paymentDate && (
                            <div className="pt-4 text-sm text-muted-foreground">
                              Payment Date: {formatDate(record.paymentDate)}
                            </div>
                          )}
                          <Button className="w-full">
                            <DownloadIcon className="h-4 w-4 mr-2" /> Download PDF
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                {record.paymentDate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Paid on {formatDate(record.paymentDate)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
