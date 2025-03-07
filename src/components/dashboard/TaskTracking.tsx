
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PlusCircle, Trash2, Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  date: string;
  timeSpent: number; // in minutes
}

export default function TaskTracking() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem(`tasks-${user?.id}`);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    timeSpent: 0
  });
  
  const [addingTask, setAddingTask] = useState(false);
  const [completedVisible, setCompletedVisible] = useState(true);
  
  // Save tasks to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`tasks-${user.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);
  
  // Format the date to display
  const formatTaskDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format minutes to hours and minutes
  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${mins} min`;
    }
  };
  
  // Add a new task
  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      date: new Date().toISOString(),
      timeSpent: newTask.timeSpent || 0
    };
    
    setTasks([task, ...tasks]);
    setNewTask({ title: "", description: "", timeSpent: 0 });
    setAddingTask(false);
    toast.success("Task added successfully");
  };
  
  // Toggle task completion status
  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed } 
        : task
    ));
  };
  
  // Delete a task
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task deleted");
  };
  
  // Update task time spent
  const updateTaskTime = (id: number, minutes: number) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, timeSpent: task.timeSpent + minutes } 
        : task
    ));
    toast.success(`Time updated (+${minutes} min)`);
  };
  
  // Filter tasks by completion status if needed
  const filteredTasks = completedVisible 
    ? tasks 
    : tasks.filter(task => !task.completed);
  
  // Group tasks by date
  const groupedTasks: { [key: string]: Task[] } = {};
  
  filteredTasks.forEach(task => {
    const date = task.date.split('T')[0]; // Get just the date part
    if (!groupedTasks[date]) {
      groupedTasks[date] = [];
    }
    groupedTasks[date].push(task);
  });
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedTasks).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Task Tracking</CardTitle>
          <CardDescription>Track what you worked on</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCompletedVisible(!completedVisible)}
          >
            {completedVisible ? "Hide Completed" : "Show Completed"}
          </Button>
          <Button 
            size="sm"
            onClick={() => setAddingTask(!addingTask)}
          >
            {addingTask ? "Cancel" : "Add Task"}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {addingTask && (
          <div className="border rounded-md p-4 space-y-3 bg-muted/20 animate-in fade-in">
            <div className="space-y-1">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="What did you work on?"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="task-description">Description (Optional)</Label>
              <Input
                id="task-description"
                placeholder="Brief description of the task"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="time-spent">Time Spent (minutes)</Label>
              <Input
                id="time-spent"
                type="number"
                min="0"
                placeholder="0"
                value={newTask.timeSpent || ""}
                onChange={(e) => setNewTask({...newTask, timeSpent: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleAddTask}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>
        )}
        
        {sortedDates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tasks recorded yet</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => setAddingTask(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Task
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {formatTaskDate(date)}
                </h3>
                
                <div className="space-y-2">
                  {groupedTasks[date].map(task => (
                    <div 
                      key={task.id} 
                      className={`border rounded-md p-3 ${task.completed ? 'bg-muted/20' : 'bg-card'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                          />
                          <div className="space-y-1">
                            <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-sm text-muted-foreground">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs bg-muted">
                                <Clock className="mr-1 h-3 w-3" />
                                {formatTimeSpent(task.timeSpent)}
                              </Badge>
                              
                              {!task.completed && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-2 text-xs"
                                    onClick={() => updateTaskTime(task.id, 15)}
                                  >
                                    +15m
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-2 text-xs"
                                    onClick={() => updateTaskTime(task.id, 30)}
                                  >
                                    +30m
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-2 text-xs"
                                    onClick={() => updateTaskTime(task.id, 60)}
                                  >
                                    +1h
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="h-8 w-8 p-0 text-muted-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
