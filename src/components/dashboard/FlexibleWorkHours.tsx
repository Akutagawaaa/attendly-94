
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { Clock, CalendarDays, Settings } from "lucide-react";
import { toast } from "sonner";

interface WorkSchedule {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[]; // 0 = Sunday, 6 = Saturday
  isDefault: boolean;
}

export default function FlexibleWorkHours() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<WorkSchedule[]>(() => {
    // Default schedules
    const defaultSchedules: WorkSchedule[] = [
      {
        id: "standard",
        name: "Standard Hours",
        description: "Regular 9 to 5 work week",
        startTime: "09:00",
        endTime: "17:00",
        daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
        isDefault: true
      },
      {
        id: "early",
        name: "Early Bird",
        description: "Start early, leave early",
        startTime: "07:00",
        endTime: "15:00",
        daysOfWeek: [1, 2, 3, 4, 5],
        isDefault: false
      },
      {
        id: "late",
        name: "Night Owl",
        description: "Start late, leave late",
        startTime: "11:00",
        endTime: "19:00",
        daysOfWeek: [1, 2, 3, 4, 5],
        isDefault: false
      },
      {
        id: "flexible",
        name: "Flexible Hours",
        description: "Core hours with flexibility",
        startTime: "10:00",
        endTime: "16:00",
        daysOfWeek: [1, 2, 3, 4, 5],
        isDefault: false
      }
    ];
    
    const savedSchedules = localStorage.getItem(`workSchedules-${user?.id}`);
    return savedSchedules ? JSON.parse(savedSchedules) : defaultSchedules;
  });
  
  const [activeSchedule, setActiveSchedule] = useState<string>(() => {
    const savedActive = localStorage.getItem(`activeSchedule-${user?.id}`);
    return savedActive || "standard";
  });
  
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(() => {
    const savedSetting = localStorage.getItem(`workReminders-${user?.id}`);
    return savedSetting ? JSON.parse(savedSetting) : true;
  });
  
  // Save settings to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`workSchedules-${user.id}`, JSON.stringify(schedules));
      localStorage.setItem(`activeSchedule-${user.id}`, activeSchedule);
      localStorage.setItem(`workReminders-${user.id}`, JSON.stringify(reminderEnabled));
    }
  }, [schedules, activeSchedule, reminderEnabled, user]);
  
  // Get the current active schedule
  const getCurrentSchedule = () => {
    return schedules.find(s => s.id === activeSchedule) || schedules[0];
  };
  
  // Handle schedule change
  const handleScheduleChange = (id: string) => {
    setActiveSchedule(id);
    toast.success(`Schedule changed to ${schedules.find(s => s.id === id)?.name}`);
  };
  
  // Format time for display
  const formatTimeDisplay = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours, 10));
    time.setMinutes(parseInt(minutes, 10));
    
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Get day name from day number
  const getDayName = (day: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };
  
  // Check if today is a workday
  const isTodayWorkday = () => {
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    const currentSchedule = getCurrentSchedule();
    return currentSchedule.daysOfWeek.includes(today);
  };
  
  // Current schedule
  const currentSchedule = getCurrentSchedule();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Schedule</CardTitle>
        <CardDescription>Manage your flexible work hours</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current Schedule</TabsTrigger>
            <TabsTrigger value="schedules">Available Schedules</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-4">
            <div className="p-4 border rounded-lg mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">{currentSchedule.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentSchedule.description}</p>
                </div>
                
                <Badge 
                  variant="outline" 
                  className={isTodayWorkday() 
                    ? "bg-green-100 text-green-800" 
                    : "bg-amber-100 text-amber-800"}
                >
                  {isTodayWorkday() ? "Working today" : "Off today"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Work Hours</p>
                    <p className="font-medium">
                      {formatTimeDisplay(currentSchedule.startTime)} - {formatTimeDisplay(currentSchedule.endTime)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Work Days</p>
                    <p className="font-medium">
                      {currentSchedule.daysOfWeek.map(day => getDayName(day).substring(0, 3)).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Label>Switch Schedule</Label>
                <Select value={activeSchedule} onValueChange={handleScheduleChange}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select a schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    {schedules.map((schedule) => (
                      <SelectItem key={schedule.id} value={schedule.id}>
                        {schedule.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedules" className="space-y-4">
            <div className="grid gap-4 mt-4">
              {schedules.map((schedule) => (
                <div 
                  key={schedule.id} 
                  className={`p-4 border rounded-lg transition-all ${
                    schedule.id === activeSchedule 
                      ? 'border-primary/50 bg-primary/5' 
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{schedule.name}</h3>
                      <p className="text-sm text-muted-foreground">{schedule.description}</p>
                      
                      <div className="flex gap-4 mt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Hours</p>
                          <p className="text-sm">
                            {formatTimeDisplay(schedule.startTime)} - {formatTimeDisplay(schedule.endTime)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-muted-foreground">Days</p>
                          <p className="text-sm">
                            {schedule.daysOfWeek.map(day => getDayName(day).substring(0, 3)).join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant={schedule.id === activeSchedule ? "default" : "outline"}
                      size="sm" 
                      onClick={() => handleScheduleChange(schedule.id)}
                      disabled={schedule.id === activeSchedule}
                    >
                      {schedule.id === activeSchedule ? "Active" : "Activate"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="p-4 border rounded-lg mt-4 space-y-6">
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">Notification Preferences</h3>
                    <p className="text-sm text-muted-foreground">Configure your schedule notifications</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="reminder-toggle" 
                      checked={reminderEnabled}
                      onCheckedChange={setReminderEnabled}
                    />
                    <Label htmlFor="reminder-toggle" className="cursor-pointer">
                      Schedule reminders
                    </Label>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {reminderEnabled 
                      ? "You will receive reminders about your work schedule" 
                      : "Reminders about your work schedule are turned off"}
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setReminderEnabled(true);
                    toast.success("Default settings restored");
                  }}
                >
                  Reset to Default Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
