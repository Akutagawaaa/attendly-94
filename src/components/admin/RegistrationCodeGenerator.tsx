
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { registrationService } from "@/services/registrationService";
import { toast } from "sonner";

export default function RegistrationCodeGenerator() {
  const [expiryDays, setExpiryDays] = useState<number>(7);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCode = async () => {
    try {
      setIsGenerating(true);
      
      // Hardcoded admin ID for the demo - in a real app, this would come from the logged-in user
      const adminId = 1;
      
      // Convert expiryDays to a number to fix the TypeScript error
      const code = await registrationService.createRegistrationCode(Number(expiryDays), adminId);
      
      if (code) {
        setGeneratedCode(code.code);
        toast.success("Registration code generated successfully");
      }
    } catch (error) {
      console.error("Error generating registration code:", error);
      toast.error("Failed to generate registration code");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Registration Code</CardTitle>
        <CardDescription>
          Create a code for new employees to register with
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="expiry" className="text-sm font-medium">
            Expiry (Days)
          </label>
          <Input
            id="expiry"
            type="number"
            value={expiryDays}
            onChange={(e) => setExpiryDays(parseInt(e.target.value))}
            min={1}
            max={30}
          />
        </div>
        
        {generatedCode && (
          <div className="p-3 bg-muted rounded-md">
            <p className="font-mono text-center font-bold text-xl">{generatedCode}</p>
            <p className="text-xs text-center text-muted-foreground mt-1">
              Valid for {expiryDays} days
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerateCode} 
          className="w-full" 
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Code"}
        </Button>
      </CardFooter>
    </Card>
  );
}
