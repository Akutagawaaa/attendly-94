
import { useState, useEffect } from "react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import { LogIn, LogOut, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatTime } from "@/lib/utils";

interface CheckInOutProps {
  onCheckInOut: () => void;
  checkedIn: boolean;
  lastCheckIn: Date | null;
}

export default function CheckInOut({ onCheckInOut, checkedIn, lastCheckIn }: CheckInOutProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Set up auto-checkout reminder
  useEffect(() => {
    if (!checkedIn || !lastCheckIn) return;
    
    // Check if the user has been checked in for more than 8 hours
    const checkInTime = new Date(lastCheckIn).getTime();
    const currentTime = new Date().getTime();
    const eightHoursInMs = 8 * 60 * 60 * 1000;
    
    if (currentTime - checkInTime > eightHoursInMs) {
      toast("Don't forget to check out!", {
        description: "You've been checked in for over 8 hours.",
        action: {
          label: "Check out",
          onClick: () => handleCheckOut(),
        },
      });
    } else {
      // Set up a reminder to trigger when 8 hours is reached
      const timeUntil8Hours = eightHoursInMs - (currentTime - checkInTime);
      
      const reminderId = setTimeout(() => {
        toast("You've been checked in for 8 hours", {
          description: "Please remember to check out at the end of your workday.",
          action: {
            label: "Check out",
            onClick: () => handleCheckOut(),
          },
        });
      }, timeUntil8Hours);
      
      return () => clearTimeout(reminderId);
    }
    
    // Set up reminder for end of day (5:00 PM)
    const endOfDay = new Date();
    endOfDay.setHours(17, 0, 0, 0); // 5:00 PM
    
    // Only set reminder if it's before 5 PM
    if (new Date() < endOfDay) {
      const timeUntilEndOfDay = endOfDay.getTime() - new Date().getTime();
      
      const reminderId = setTimeout(() => {
        toast("End of workday", {
          description: "It's 5:00 PM. Don't forget to check out!",
          action: {
            label: "Check out",
            onClick: () => handleCheckOut(),
          },
        });
      }, timeUntilEndOfDay);
      
      return () => clearTimeout(reminderId);
    }
  }, [checkedIn, lastCheckIn]);
  
  if (!user) return null;
  
  const handleCheckIn = async () => {
    try {
      setLoading(true);
      await apiService.checkIn(user.id);
      toast.success("Checked in successfully");
      onCheckInOut();
    } catch (error: any) {
      toast.error(error.message || "Failed to check in");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckOut = async () => {
    try {
      setLoading(true);
      await apiService.checkOut(user.id);
      toast.success("Checked out successfully. See you tomorrow!");
      onCheckInOut();
    } catch (error: any) {
      toast.error(error.message || "Failed to check out");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const getCurrentTimeString = () => {
    return formatTime(new Date());
  };
  
  return (
    <Card className="overflow-hidden border">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <p className="text-2xl font-semibold mb-1">{getCurrentTimeString()}</p>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString([], { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="w-32 h-32 rounded-full bg-muted/30 border-4 border-primary/20 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300"></div>
            <Timer className="h-12 w-12 text-primary/80" />
          </div>
          
          <div className="space-y-4 w-full">
            {checkedIn ? (
              <div className="space-y-3">
                <div className="bg-green-50 text-green-700 text-xs font-medium py-2 px-3 rounded-md flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  Checked in at {lastCheckIn ? formatTime(lastCheckIn) : ''}
                </div>
                <ButtonCustom
                  onClick={handleCheckOut}
                  loading={loading}
                  className="w-full"
                  variant="shine"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Check Out
                </ButtonCustom>
              </div>
            ) : (
              <ButtonCustom
                onClick={handleCheckIn}
                loading={loading}
                className="w-full"
                variant="shine"
              >
                <LogIn className="mr-2 h-4 w-4" /> Check In
              </ButtonCustom>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
