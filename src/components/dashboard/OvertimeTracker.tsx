
import { useState } from "react";
import { OvertimeRecord } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Clock, DollarSign } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface OvertimeTrackerProps {
  overtimeRecords: OvertimeRecord[];
  onOvertimeSubmit: () => void;
  loading?: boolean;
}

export default function OvertimeTracker({ overtimeRecords, onOvertimeSubmit, loading = false }: OvertimeTrackerProps) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date(),
    hours: 1,
    rate: 1.5,
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      await apiService.submitOvertimeRequest(user.id, {
        date: formData.date.toISOString(),
        hours: formData.hours,
        rate: formData.rate,
        reason: formData.reason,
      });
      
      toast.success("Overtime request submitted successfully");
      setShowForm(false);
      setFormData({
        date: new Date(),
        hours: 1,
        rate: 1.5,
        reason: "",
      });
      onOvertimeSubmit();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit overtime request");
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
  
  // Sort by date, newest first
  const sortedRecords = [...overtimeRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Overtime Tracker</CardTitle>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Request Overtime"}
        </Button>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="overtime-date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData({ ...formData, date: date || new Date() })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="overtime-hours">Hours</Label>
                <Input
                  id="overtime-hours"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="overtime-rate">Rate Multiplier</Label>
                <Input
                  id="overtime-rate"
                  type="number"
                  min="1"
                  step="0.5"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="overtime-reason">Reason</Label>
              <Textarea
                id="overtime-reason"
                placeholder="Briefly describe why overtime was needed"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="h-20"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sortedRecords.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No overtime records found</p>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {sortedRecords.map((record) => (
              <div
                key={record.id}
                className="border p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{format(parseISO(record.date), "MMMM d, yyyy")}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{record.hours} hour{record.hours !== 1 ? "s" : ""}</span>
                      <span className="mx-1">•</span>
                      <DollarSign className="h-3 w-3" />
                      <span>{record.rate}x rate</span>
                    </div>
                  </div>
                  {getStatusBadge(record.status)}
                </div>
                {record.reason && (
                  <div className="mt-2 text-sm">
                    <p className="line-clamp-2">{record.reason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
