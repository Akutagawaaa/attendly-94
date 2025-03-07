
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { toast } from "sonner";

type Event = {
  id: number;
  title: string;
  date: Date;
  type: "meeting" | "appointment" | "leave" | "holiday";
};

export default function CalendarIntegration() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>(() => {
    // Initialize with some mock events for demonstration
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return [
      { id: 1, title: "Team Meeting", date: today, type: "meeting" },
      { id: 2, title: "Dentist Appointment", date: tomorrow, type: "appointment" },
      { id: 3, title: "Product Review", date: nextWeek, type: "meeting" },
    ];
  });
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "meeting" as Event["type"],
  });
  
  const [showAddEvent, setShowAddEvent] = useState(false);
  
  // Find events for a specific date
  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    return events.filter(
      (event) => 
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Add a new event
  const handleAddEvent = () => {
    if (!date) return;
    if (!newEvent.title.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    
    const newEventObject: Event = {
      id: Date.now(),
      title: newEvent.title,
      date: new Date(date),
      type: newEvent.type,
    };
    
    setEvents([...events, newEventObject]);
    setNewEvent({ title: "", type: "meeting" });
    setShowAddEvent(false);
    
    toast.success("Event added to calendar");
  };
  
  // Get highlighted dates for the calendar
  const getHighlightedDates = () => {
    return events.map(event => new Date(event.date));
  };
  
  // Get the color for a specific event type
  const getEventColor = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "appointment":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "leave":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "holiday":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  const currentEvents = getEventsForDate(date);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Calendar</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddEvent(!showAddEvent)}
          className="h-8 gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Event</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                booked: getHighlightedDates(),
              }}
              modifiersStyles={{
                booked: {
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '0',
                }
              }}
            />
          </div>
          
          <div className="md:col-span-2 space-y-4">
            {showAddEvent && (
              <div className="space-y-3 p-3 border rounded-md">
                <h3 className="font-medium text-sm flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Add Event for {date ? format(date, 'MMM d, yyyy') : 'Today'}
                </h3>
                
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input
                      id="event-title"
                      placeholder="Enter event title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="event-type">Event Type</Label>
                    <select
                      id="event-type"
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as Event["type"] })}
                    >
                      <option value="meeting">Meeting</option>
                      <option value="appointment">Appointment</option>
                      <option value="leave">Leave</option>
                      <option value="holiday">Holiday</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAddEvent(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleAddEvent}
                  >
                    Add Event
                  </Button>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-3">
                {date ? format(date, 'MMMM d, yyyy') : 'Today'}'s Events
              </h3>
              
              {currentEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No events scheduled</p>
              ) : (
                <div className="space-y-2">
                  {currentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-2 border rounded-md flex items-center justify-between"
                    >
                      <span className="text-sm">{event.title}</span>
                      <Badge 
                        variant="outline" 
                        className={getEventColor(event.type)}
                      >
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
