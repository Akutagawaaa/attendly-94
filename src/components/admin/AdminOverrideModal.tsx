
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import { User } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";

interface AdminOverrideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: number | null;
  employees: User[];
  onOverrideComplete: () => void;
}

export default function AdminOverrideModal({
  open,
  onOpenChange,
  employeeId,
  employees,
  onOverrideComplete
}: AdminOverrideModalProps) {
  const { user } = useAuth();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(employeeId);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [actionType, setActionType] = useState<string>("check-in");
  const [time, setTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
  );
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployeeId || !date || !time || !actionType || !user?.id) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      setLoading(true);
      
      // Create a Date object from the date and time inputs
      const [hours, minutes] = time.split(':').map(Number);
      const overrideDate = new Date(date);
      overrideDate.setHours(hours, minutes, 0, 0);
      
      if (actionType === "check-in") {
        await apiService.adminOverrideCheckIn(selectedEmployeeId, overrideDate, user.id);
        toast.success("Check-in time overridden successfully");
      } else {
        await apiService.adminOverrideCheckOut(selectedEmployeeId, overrideDate, user.id);
        toast.success("Check-out time overridden successfully");
      }
      
      onOverrideComplete();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to override attendance");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Override Attendance</DialogTitle>
          <DialogDescription>
            Manually set check-in or check-out time for an employee.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <Select
              value={selectedEmployeeId?.toString() || ""}
              onValueChange={(value) => setSelectedEmployeeId(Number(value))}
            >
              <SelectTrigger id="employee">
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
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="action-type">Action Type</Label>
            <Select
              value={actionType}
              onValueChange={setActionType}
            >
              <SelectTrigger id="action-type">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="check-in">Check In</SelectItem>
                <SelectItem value="check-out">Check Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Override"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
