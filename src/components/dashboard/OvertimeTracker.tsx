
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiService, OvertimeRecord } from "@/services/api";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { Clock, Plus } from "lucide-react";

interface OvertimeTrackerProps {
  overtimeRecords: OvertimeRecord[];
  onOvertimeSubmit: () => void;
  loading: boolean;
}

export default function OvertimeTracker({ overtimeRecords, onOvertimeSubmit, loading }: OvertimeTrackerProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: 1,
    reason: "",
    rate: 1.5,
  });

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      await apiService.submitOvertimeRequest({
        employeeId: user.id,
        date: formData.date,
        hours: formData.hours,
        reason: formData.reason,
        rate: formData.rate,
      });
      
      toast.success("Overtime request submitted successfully");
      setOpen(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        hours: 1,
        reason: "",
        rate: 1.5,
      });
      onOvertimeSubmit();
    } catch (error) {
      console.error("Failed to submit overtime request", error);
      toast.error("Failed to submit overtime request");
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle>Overtime Tracker</CardTitle>
          <CardDescription>Request and track overtime hours</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Overtime Request</DialogTitle>
              <DialogDescription>
                Enter details about your overtime work for approval.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Overtime Rate</Label>
                  <select
                    id="rate"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                  >
                    <option value="1.5">Regular (1.5x)</option>
                    <option value="2">Double (2x)</option>
                    <option value="3">Holiday (3x)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Explain why overtime was needed"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : overtimeRecords.length === 0 ? (
          <div className="text-center py-8 space-y-3 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto opacity-20" />
            <p>No overtime records found.</p>
            <p className="text-sm">Submit a new request when you work overtime hours.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {overtimeRecords.map((record) => (
              <div key={record.id} className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{formatDate(new Date(record.date))}</p>
                    <p className="text-sm text-muted-foreground mt-1">{record.reason}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(record.status)}
                    <p className="text-sm font-medium mt-1">{record.hours} hours ({record.rate}x)</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
