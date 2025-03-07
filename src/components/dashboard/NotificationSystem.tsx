
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff, Clock, Calendar, User, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
}

export default function NotificationSystem() {
  const { user } = useAuth();
  
  // Initialize with some mock notifications
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem(`notifications-${user?.id}`);
    
    if (savedNotifications) {
      return JSON.parse(savedNotifications);
    }
    
    // Default notifications
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    
    return [
      {
        id: 1,
        title: "Team Meeting Reminder",
        message: "Weekly team meeting starts in 30 minutes",
        type: "info",
        timestamp: now.toISOString(),
        read: false
      },
      {
        id: 2,
        title: "Sarah checked in",
        message: "Sarah Miller just checked in for today",
        type: "info",
        timestamp: oneHourAgo.toISOString(),
        read: false
      },
      {
        id: 3,
        title: "Leave Request Approved",
        message: "Your leave request for next week has been approved",
        type: "success",
        timestamp: threeDaysAgo.toISOString(),
        read: true
      }
    ];
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    checkInAlerts: true,
    meetingReminders: true, 
    leaveUpdates: true
  });
  
  // Save notifications to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`notifications-${user.id}`, JSON.stringify(notifications));
      localStorage.setItem(`notificationSettings-${user.id}`, JSON.stringify(notificationSettings));
    }
  }, [notifications, notificationSettings, user]);
  
  // Get notification icon based on type
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Bell className="h-4 w-4" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4" />;
      case "warning":
        return <Clock className="h-4 w-4" />;
      case "error":
        return <BellOff className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  // Get notification badge color based on type
  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "success":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "warning":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "error":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true } 
        : notification
    ));
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => 
      ({ ...notification, read: true })
    ));
    toast.success("All notifications marked as read");
  };
  
  // Toggle notification setting
  const toggleNotificationSetting = (key: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key]
    });
  };
  
  // Filter notifications that haven't been read
  const unreadNotifications = notifications.filter(notification => !notification.read);
  
  // Generate a test notification for demonstration
  const generateTestNotification = () => {
    const notificationTypes: Notification["type"][] = ["info", "success", "warning", "error"];
    const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    
    let title, message;
    
    switch (randomType) {
      case "info":
        title = "New Team Update";
        message = "There's an important update about the ongoing project";
        break;
      case "success":
        title = "Task Completed";
        message = "Your assigned task has been marked as complete";
        break;
      case "warning":
        title = "Deadline Approaching";
        message = "Project deadline is approaching in 2 days";
        break;
      case "error":
        title = "Meeting Cancelled";
        message = "The scheduled team meeting has been cancelled";
        break;
    }
    
    const newNotification: Notification = {
      id: Date.now(),
      title,
      message,
      type: randomType,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications([newNotification, ...notifications]);
    
    toast({
      title: newNotification.title,
      description: newNotification.message,
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Notifications</CardTitle>
        <div className="flex space-x-2">
          {unreadNotifications.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
          <Button 
            size="sm"
            onClick={generateTestNotification}
          >
            Test Notification
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="border-b">
          <div className="flex overflow-auto py-1 px-2">
            <div className="flex w-full justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full px-3"
              >
                All
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full px-3"
              >
                <Bell className="mr-1 h-3.5 w-3.5 text-blue-500" />
                Info
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full px-3"
              >
                <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-green-500" />
                Success
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full px-3"
              >
                <Clock className="mr-1 h-3.5 w-3.5 text-amber-500" />
                Warning
              </Button>
            </div>
          </div>
        </div>
        
        <div className="divide-y">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="mb-2 h-8 w-8 text-muted-foreground" />
              <h3 className="text-lg font-medium">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up! No new notifications.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 ${notification.read ? 'bg-background' : 'bg-muted/20'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      getNotificationColor(notification.type).replace('bg-', 'bg-').replace('text-', 'text-')
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-medium ${notification.read ? '' : 'font-semibold'}`}>
                          {notification.title}
                        </h4>
                        
                        {!notification.read && (
                          <Badge 
                            variant="outline" 
                            className="h-5 px-1.5 text-[10px] bg-primary text-primary-foreground border-primary"
                          >
                            NEW
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t">
          <h3 className="text-sm font-medium mb-3">Notification Settings</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="check-in-setting">Check-in alerts</Label>
              </div>
              <Switch 
                id="check-in-setting" 
                checked={notificationSettings.checkInAlerts}
                onCheckedChange={() => toggleNotificationSetting('checkInAlerts')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="meeting-setting">Meeting reminders</Label>
              </div>
              <Switch 
                id="meeting-setting" 
                checked={notificationSettings.meetingReminders}
                onCheckedChange={() => toggleNotificationSetting('meetingReminders')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="leave-setting">Leave updates</Label>
              </div>
              <Switch 
                id="leave-setting" 
                checked={notificationSettings.leaveUpdates}
                onCheckedChange={() => toggleNotificationSetting('leaveUpdates')}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
