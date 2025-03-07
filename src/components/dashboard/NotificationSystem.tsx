
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, Check, X, Clock, UserPlus, Calendar, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type NotificationType = "team-checkin" | "team-checkout" | "meeting" | "task" | "announcement";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionable?: boolean;
}

export default function NotificationSystem() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock notifications
        const mockNotifications: Notification[] = [
          {
            id: "notif-1",
            type: "team-checkin",
            title: "Team Member Checked In",
            message: "Alex Johnson just checked in for the day",
            time: new Date(new Date().getTime() - 15 * 60000).toISOString(),
            read: false,
          },
          {
            id: "notif-2",
            type: "meeting",
            title: "Upcoming Team Meeting",
            message: "Weekly standup meeting in 30 minutes",
            time: new Date(new Date().getTime() - 30 * 60000).toISOString(),
            read: true,
            actionable: true,
          },
          {
            id: "notif-3",
            type: "task",
            title: "Task Assigned",
            message: "You have been assigned a new task: Update documentation",
            time: new Date(new Date().getTime() - 2 * 60 * 60000).toISOString(),
            read: false,
            actionable: true,
          },
          {
            id: "notif-4",
            type: "announcement",
            title: "Company Announcement",
            message: "New policy updates available in the HR portal",
            time: new Date(new Date().getTime() - 1 * 24 * 60 * 60000).toISOString(),
            read: true,
          },
        ];
        
        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up a timer to refresh notifications every minute
    const intervalId = setInterval(() => {
      // In a real app, this would fetch new notifications from the server
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const getTimeAgo = (timeString: string) => {
    const now = new Date();
    const time = new Date(timeString);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };
  
  const markAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };
  
  const dismissNotification = (notificationId: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== notificationId));
  };
  
  const handleNotificationAction = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Mock different actions based on notification type
    switch (notification.type) {
      case "meeting":
        toast("Opening calendar application...");
        break;
      case "task":
        toast("Opening task details...");
        break;
      default:
        toast("Action performed");
    }
  };
  
  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case "team-checkin":
      case "team-checkout":
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case "meeting":
        return <Calendar className="h-4 w-4 text-green-500" />;
      case "task":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "announcement":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      default:
        return <BellRing className="h-4 w-4 text-primary" />;
    }
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;
  
  const createMockNotification = () => {
    const types: NotificationType[] = ["team-checkin", "meeting", "task", "announcement"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const titles = {
      "team-checkin": "Team Member Activity",
      "meeting": "Calendar Update",
      "task": "Task Assignment",
      "announcement": "Company Announcement"
    };
    
    const messages = {
      "team-checkin": ["Sarah just checked in", "David is now online", "Emma started her workday"],
      "meeting": ["Project review in 15 minutes", "1-on-1 with manager scheduled", "Team lunch at noon"],
      "task": ["New task assigned: Review PR", "Task deadline approaching", "Your task was approved"],
      "announcement": ["Office closed this Friday", "New benefits information", "Quarterly results are in"]
    };
    
    const randomMessage = messages[randomType][Math.floor(Math.random() * messages[randomType].length)];
    
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: randomType,
      title: titles[randomType],
      message: randomMessage,
      time: new Date().toISOString(),
      read: false,
      actionable: Math.random() > 0.5
    };
    
    setNotifications([newNotification, ...notifications]);
    
    // Fix the toast call to use the proper format
    toast(newNotification.title, {
      description: newNotification.message,
    });
  };
  
  if (loading) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-primary rounded-full" role="status" aria-label="loading"></div>
          <div className="mt-2 text-sm text-muted-foreground">Loading notifications...</div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2">{unreadCount}</Badge>
            )}
          </CardTitle>
          <CardDescription>Stay updated with team activities</CardDescription>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8"
          onClick={createMockNotification}
        >
          Test Notification
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="actionable">Actionable</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="m-0">
            <div className="space-y-1 max-h-[500px] overflow-y-auto px-2">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-4 p-3 rounded-lg hover:bg-accent/40 transition-colors ${
                      !notification.read ? "bg-accent/20" : ""
                    }`}
                  >
                    <div className="mt-1">
                      {getIconForType(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {getTimeAgo(notification.time)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      {notification.actionable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 mt-1 text-xs px-2"
                          onClick={() => handleNotificationAction(notification)}
                        >
                          View Details
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Dismiss</span>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center p-6 text-center">
                  <div className="space-y-2">
                    <BellRing className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      No notifications to display
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="unread" className="m-0">
            <div className="space-y-1 max-h-[500px] overflow-y-auto px-2">
              {notifications.filter(n => !n.read).length > 0 ? (
                notifications
                  .filter(n => !n.read)
                  .map((notification) => (
                    // ... Same notification template as above
                    <div
                      key={notification.id}
                      className="flex items-start space-x-4 p-3 rounded-lg hover:bg-accent/40 transition-colors bg-accent/20"
                    >
                      <div className="mt-1">
                        {getIconForType(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(notification.time)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        {notification.actionable && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 mt-1 text-xs px-2"
                            onClick={() => handleNotificationAction(notification)}
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => dismissNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Dismiss</span>
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="flex items-center justify-center p-6 text-center">
                  <div className="space-y-2">
                    <Check className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      No unread notifications
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="actionable" className="m-0">
            <div className="space-y-1 max-h-[500px] overflow-y-auto px-2">
              {notifications.filter(n => n.actionable).length > 0 ? (
                notifications
                  .filter(n => n.actionable)
                  .map((notification) => (
                    // ... Same notification template as above
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-4 p-3 rounded-lg hover:bg-accent/40 transition-colors ${
                        !notification.read ? "bg-accent/20" : ""
                      }`}
                    >
                      <div className="mt-1">
                        {getIconForType(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(notification.time)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 mt-1 text-xs px-2"
                          onClick={() => handleNotificationAction(notification)}
                        >
                          View Details
                        </Button>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => dismissNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Dismiss</span>
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="flex items-center justify-center p-6 text-center">
                  <div className="space-y-2">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      No actionable notifications
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
