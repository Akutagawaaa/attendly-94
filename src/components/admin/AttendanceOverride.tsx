
import { Button } from "@/components/ui/button";
import { User } from "@/models/types";
import { UserCog } from "lucide-react";

interface AttendanceOverrideProps {
  employees: User[];
  onOpenOverrideModal: (employeeId: number) => void;
}

export default function AttendanceOverride({ employees, onOpenOverrideModal }: AttendanceOverrideProps) {
  return (
    <div className="p-6 border rounded-lg bg-card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium">Attendance Override</h3>
          <p className="text-muted-foreground">Override check-in and check-out times for employees</p>
        </div>
        <Button 
          onClick={() => onOpenOverrideModal(0)}
          className="flex items-center gap-2"
        >
          <UserCog className="h-4 w-4" />
          New Override
        </Button>
      </div>
      
      <div className="space-y-4">
        <p>Select an employee to manually adjust their check-in or check-out time.</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map(employee => (
            <div 
              key={employee.id} 
              className="p-4 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer" 
              onClick={() => onOpenOverrideModal(employee.id)}
            >
              <h4 className="font-medium">{employee.name}</h4>
              <p className="text-sm text-muted-foreground">{employee.department}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
