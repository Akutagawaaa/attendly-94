
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import RegistrationCodeGenerator from "@/components/admin/RegistrationCodeGenerator";

export default function RegistrationPanel() {
  return (
    <div className="p-6 border rounded-lg bg-card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium">Employee Registration</h3>
          <p className="text-muted-foreground">Manage new employee registration</p>
        </div>
        <Button 
          onClick={() => window.open('/register', '_blank')}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Registration Page
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <RegistrationCodeGenerator />
        
        <Card>
          <CardHeader>
            <CardTitle>Registration Instructions</CardTitle>
            <CardDescription>How to onboard new employees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2">
              <li>Generate a unique registration code from this panel</li>
              <li>Share the code with the new employee</li>
              <li>Direct them to the registration page at <code className="bg-muted px-1 py-0.5 rounded text-sm">/register</code></li>
              <li>The employee creates their account using the provided code</li>
              <li>Once registered, they can log in to the system</li>
            </ol>
            
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md text-sm">
              <p className="font-medium text-yellow-800">Important:</p>
              <p className="text-yellow-700">Registration codes are valid for a limited time and can only be used once. Generate new codes for each employee.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
