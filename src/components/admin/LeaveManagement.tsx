import { useState } from "react";
import { LeaveRequest, User } from "@/models/types";
import { format, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarClock, CheckCircle, FileText, XCircle } from "lucide-react";

interface LeaveManagementProps {
  leaveRequests: LeaveRequest[];
  employees: User[];
  loading: boolean;
  onStatusUpdate: (id: number, status: "approved" | "rejected") => Promise<void>;
}

export default function LeaveManagement({
  leaveRequests,
  employees,
  loading,
  onStatusUpdate,
}: LeaveManagementProps) {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 text-white">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
    }
  };
  
  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return employee ? employee.name : "Unknown Employee";
  };
  
  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
  };
  
  const handleUpdateStatus = async (status: "approved" | "rejected") => {
    if (!selectedRequest) return;
    
    try {
      setIsUpdating(true);
      await onStatusUpdate(selectedRequest.id, status);
      setSelectedRequest(null);
    } catch (error) {
      console.error(`Failed to ${status} leave request`, error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const sortedRequests = [...leaveRequests].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Management</CardTitle>
        <CardDescription>
          Review and manage employee leave requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sortedRequests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No leave requests found</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {getEmployeeName(request.employeeId)}
                    </TableCell>
                    <TableCell>
                      {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                    </TableCell>
                    <TableCell>
                      {format(parseISO(request.startDate), "MMM dd")} - {format(parseISO(request.endDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{format(parseISO(request.createdAt), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(request)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {selectedRequest && (
          <Dialog
            open={!!selectedRequest}
            onOpenChange={(open) => !open && setSelectedRequest(null)}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Leave Request Details</DialogTitle>
                <DialogDescription>
                  Submitted on {format(parseISO(selectedRequest.createdAt), "MMMM dd, yyyy")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Employee</div>
                    <div>{getEmployeeName(selectedRequest.employeeId)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Status</div>
                    <div>{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Leave Type</div>
                  <div>{selectedRequest.type.charAt(0).toUpperCase() + selectedRequest.type.slice(1)} Leave</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Duration</div>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" />
                    <span>
                      {format(parseISO(selectedRequest.startDate), "MMM dd, yyyy")} - {format(parseISO(selectedRequest.endDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Reason</div>
                  <div className="bg-muted p-3 rounded-md">
                    {selectedRequest.reason}
                  </div>
                </div>
                
                {selectedRequest.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus("rejected")}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus("approved")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
