
import { useState } from "react";
import { OvertimeRecord, apiService, User } from "@/services/api";
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
import { CheckCircle, Clock, FilterIcon, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface OvertimeManagementProps {
  overtimeRecords: OvertimeRecord[];
  employees: User[];
  loading: boolean;
  onOvertimeUpdate: () => void;
}

export default function OvertimeManagement({ overtimeRecords, employees, loading, onOvertimeUpdate }: OvertimeManagementProps) {
  const { user } = useAuth();
  const [filterEmployee, setFilterEmployee] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [processingId, setProcessingId] = useState<number | null>(null);
  
  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : "Unknown Employee";
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  };
  
  const handleApproveOvertime = async (id: number) => {
    if (!user) return;
    
    try {
      setProcessingId(id);
      await apiService.updateOvertimeStatus(id, "approved", user.id);
      toast.success("Overtime request approved");
      onOvertimeUpdate();
    } catch (error) {
      console.error("Failed to approve overtime", error);
      toast.error("Failed to approve overtime");
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleRejectOvertime = async (id: number) => {
    if (!user) return;
    
    try {
      setProcessingId(id);
      await apiService.updateOvertimeStatus(id, "rejected", user.id);
      toast.success("Overtime request rejected");
      onOvertimeUpdate();
    } catch (error) {
      console.error("Failed to reject overtime", error);
      toast.error("Failed to reject overtime");
    } finally {
      setProcessingId(null);
    }
  };
  
  // Apply filters
  const filteredRecords = overtimeRecords.filter(record => {
    if (filterEmployee && record.employeeId !== parseInt(filterEmployee)) return false;
    if (filterStatus && record.status !== filterStatus) return false;
    return true;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overtime Management</h2>
          <p className="text-muted-foreground">Review and approve overtime requests</p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Overtime Requests</CardTitle>
          <CardDescription>Manage employee overtime hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium mb-1 block">Employee</label>
              <Select value={filterEmployee} onValueChange={setFilterEmployee}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Employees</SelectItem>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>{employee.name}</SelectItem>
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end ml-auto">
              <Button variant="outline" size="sm" onClick={() => {
                setFilterEmployee("");
                setFilterStatus("");
              }}>
                <FilterIcon className="h-4 w-4 mr-2" /> Clear Filters
              </Button>
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
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No overtime requests found
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
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            {formatDate(new Date(record.date))}
                          </div>
                        </TableCell>
                        <TableCell>{record.hours}h</TableCell>
                        <TableCell>{record.rate}x</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {record.reason}
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="text-right">
                          {record.status === "pending" ? (
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline" 
                                size="sm"
                                onClick={() => handleApproveOvertime(record.id)}
                                disabled={processingId === record.id}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRejectOvertime(record.id)}
                                disabled={processingId === record.id}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <Button variant="outline" size="sm" disabled>
                              {record.status === "approved" ? "Approved" : "Rejected"}
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
