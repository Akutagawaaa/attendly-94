
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeaveRequest } from "@/services/api";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface LeaveHistoryProps {
  leaveRequests: LeaveRequest[];
  loading?: boolean;
}

export default function LeaveHistory({ leaveRequests, loading = false }: LeaveHistoryProps) {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), "MMM dd, yyyy");
  };

  const calculateDuration = (startStr: string, endStr: string) => {
    const startDate = parseISO(startStr);
    const endDate = parseISO(endStr);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end days
    return `${diffDays} day${diffDays === 1 ? "" : "s"}`;
  };

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Leave History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : leaveRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No leave requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaveRequests.map((request) => (
              <div
                key={request.id}
                className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">
                    {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Leave
                  </div>
                  <Badge 
                    className={`${getStatusColor(request.status)} text-white`}
                    variant="outline"
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{calculateDuration(request.startDate, request.endDate)}</span>
                </div>
                <div className="mt-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleViewDetails(request)}
                      >
                        <FileText className="mr-1 h-3.5 w-3.5" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    {selectedRequest && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Leave Request Details</DialogTitle>
                          <DialogDescription>
                            Submitted on {formatDate(selectedRequest.createdAt)}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium mb-1">Type</div>
                              <div className="text-sm">
                                {selectedRequest.type.charAt(0).toUpperCase() + selectedRequest.type.slice(1)} Leave
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-1">Status</div>
                              <Badge 
                                className={`${getStatusColor(selectedRequest.status)} text-white`}
                                variant="outline"
                              >
                                {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium mb-1">Duration</div>
                            <div className="text-sm flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}
                              <span className="text-muted-foreground">
                                ({calculateDuration(selectedRequest.startDate, selectedRequest.endDate)})
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium mb-1">Reason</div>
                            <div className="text-sm bg-muted p-3 rounded-md">
                              {selectedRequest.reason}
                            </div>
                          </div>
                          
                          {selectedRequest.status !== 'pending' && (
                            <div>
                              <div className="text-sm font-medium mb-1">
                                {selectedRequest.status === 'approved' ? 'Approved' : 'Rejected'} by
                              </div>
                              <div className="text-sm">
                                Admin User
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
