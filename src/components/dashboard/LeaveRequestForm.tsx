
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface LeaveRequestFormProps {
  onSubmit: () => void;
}

export default function LeaveRequestForm({ onSubmit }: LeaveRequestFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const [reason, setReason] = useState("");
  const [leaveType, setLeaveType] = useState("annual");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Add employeeId to the request
      await apiService.createLeaveRequest({
        startDate: date.from.toISOString(),
        endDate: date.to.toISOString(),
        reason,
        employeeId: user.id  // Add the missing employeeId property
      }, user.id);
      
      toast.success("Leave request submitted successfully");
      setDate({
        from: new Date(),
        to: addDays(new Date(), 1),
      });
      setReason("");
      setLeaveType("annual");
      onSubmit();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit leave request");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Request Leave</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="leave-type">Leave Type</Label>
            <Select value={leaveType} onValueChange={setLeaveType} required>
              <SelectTrigger id="leave-type" className="w-full">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annual">Annual Leave</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
                <SelectItem value="maternity">Maternity Leave</SelectItem>
                <SelectItem value="paternity">Paternity Leave</SelectItem>
                <SelectItem value="unpaid">Unpaid Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="leave-dates">Date Range</Label>
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="leave-dates"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "PPP")} - {format(date.to, "PPP")}
                        </>
                      ) : (
                        format(date.from, "PPP")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date.from}
                    selected={{ from: date.from, to: date.to }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDate({ from: range.from, to: range.to });
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="leave-reason">Reason for Leave</Label>
            <Textarea
              id="leave-reason"
              placeholder="Please provide details about your leave request"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-20"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
