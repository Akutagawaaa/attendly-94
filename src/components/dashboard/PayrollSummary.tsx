
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PayrollRecord } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeIndianRupee, Clock } from "lucide-react";
import { format } from "date-fns";

interface PayrollSummaryProps {
  payrollRecords: PayrollRecord[];
  loading: boolean;
}

export default function PayrollSummary({ payrollRecords, loading }: PayrollSummaryProps) {
  if (loading) {
    return <PayrollSummarySkeleton />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatMonth = (monthName: string, year: number) => {
    return `${monthName} ${year}`;
  };
  
  // Get latest record
  const latestRecord = payrollRecords.length > 0 
    ? payrollRecords.sort((a, b) => {
        const dateA = new Date(`${a.month} 1, ${a.year}`);
        const dateB = new Date(`${b.month} 1, ${b.year}`);
        return dateB.getTime() - dateA.getTime();
      })[0]
    : null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Payroll Summary</CardTitle>
        <CardDescription>Your salary and payment information</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="mb-4 w-full">
            <TabsTrigger className="flex-1" value="current">Current Period</TabsTrigger>
            <TabsTrigger className="flex-1" value="history">Payment History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            {latestRecord ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {formatMonth(latestRecord.month, latestRecord.year)}
                    </p>
                    <h3 className="text-2xl font-bold flex items-center gap-1">
                      {formatCurrency(latestRecord.netSalary)}
                      <BadgeIndianRupee className="h-5 w-5 text-primary" />
                    </h3>
                  </div>
                  <div className={`px-3 py-1 rounded text-xs font-medium ${
                    latestRecord.status === 'paid' ? 'bg-green-100 text-green-800' :
                    latestRecord.status === 'processed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {latestRecord.status === 'paid' ? 'Paid' :
                     latestRecord.status === 'processed' ? 'Processed' : 'Draft'}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="text-sm text-muted-foreground">Base Salary</div>
                    <div className="text-sm font-medium text-right">{formatCurrency(latestRecord.baseSalary)}</div>
                    
                    <div className="text-sm text-muted-foreground">Overtime Pay</div>
                    <div className="text-sm font-medium text-right">{formatCurrency(latestRecord.overtimePay)}</div>
                    
                    <div className="text-sm text-muted-foreground">Bonus</div>
                    <div className="text-sm font-medium text-right">{formatCurrency(latestRecord.bonus)}</div>
                    
                    <div className="text-sm text-muted-foreground">Deductions</div>
                    <div className="text-sm font-medium text-right text-red-500">
                      -{formatCurrency(latestRecord.deductions)}
                    </div>
                    
                    <div className="text-sm font-medium pt-2 border-t mt-2">Net Salary</div>
                    <div className="text-sm font-bold pt-2 border-t mt-2 text-right">
                      {formatCurrency(latestRecord.netSalary)}
                    </div>
                  </div>
                </div>
                
                {latestRecord.status === 'paid' && latestRecord.paymentDate && (
                  <div className="flex items-center text-xs text-muted-foreground mt-4">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Paid on {format(new Date(latestRecord.paymentDate), 'PPP')}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No payroll data available</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            {payrollRecords.length > 0 ? (
              <div className="space-y-4">
                {payrollRecords
                  .sort((a, b) => {
                    const dateA = new Date(`${a.month} 1, ${a.year}`);
                    const dateB = new Date(`${b.month} 1, ${b.year}`);
                    return dateB.getTime() - dateA.getTime();
                  })
                  .map((record) => (
                    <div key={record.id} className="flex justify-between items-center pb-3 border-b">
                      <div>
                        <p className="font-medium">{formatMonth(record.month, record.year)}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.status === 'paid' ? 'Paid' :
                           record.status === 'processed' ? 'Processed' : 'Draft'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(record.netSalary)}</p>
                        {record.paymentDate && (
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(record.paymentDate), 'PPP')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No payment history available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function PayrollSummarySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="space-y-3 pt-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
