import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiService } from "@/services/api";
import { User } from "@/models/types";
import { Loader2 } from "lucide-react";

export default function TeamStatusDashboard() {
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const users = await apiService.getAllEmployees();
        setTeamMembers(users);
        
        // Get today's attendance to determine who's checked in
        const attendance = await apiService.getAllAttendance();
        const today = new Date().toLocaleDateString([], {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        
        const checkedInUsers = attendance
          .filter(record => 
            record.date === today && 
            record.checkIn && 
            !record.checkOut
          )
          .map(record => record.employeeId);
        
        setOnlineUsers(checkedInUsers);
      } catch (error) {
        console.error("Failed to fetch team members", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamMembers();
    
    // Refresh every minute to keep status updated
    const interval = setInterval(fetchTeamMembers, 60000);
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Status</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.length === 0 ? (
            <p className="text-center text-muted-foreground">No team members found</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {teamMembers.map((member) => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.avatarUrl} />
                      <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.department}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={onlineUsers.includes(member.id) 
                      ? "bg-green-100 text-green-800 hover:bg-green-200" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }
                  >
                    {onlineUsers.includes(member.id) ? "Online" : "Offline"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
