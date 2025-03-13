
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiService } from "@/services/api";
import { generateRegistrationCode } from "@/lib/utils";
import { Copy, RefreshCw } from "lucide-react";

export default function RegistrationCodeGenerator() {
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [expiryDays, setExpiryDays] = useState<string>("7");
  const [loading, setLoading] = useState(false);
  
  const generateNewCode = async () => {
    try {
      setLoading(true);
      const code = generateRegistrationCode();
      
      // In a real app, save this code to the database with expiry
      await apiService.createRegistrationCode(code, parseInt(expiryDays));
      
      setGeneratedCode(code);
      toast.success("Registration code generated successfully");
    } catch (error) {
      console.error("Failed to generate registration code", error);
      toast.error("Failed to generate registration code");
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Registration code copied to clipboard");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registration Code Generator</CardTitle>
        <CardDescription>Generate registration codes for new employees</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDays">Code Expiry (days)</Label>
          <Input
            id="expiryDays"
            type="number"
            min="1"
            max="30"
            value={expiryDays}
            onChange={(e) => setExpiryDays(e.target.value)}
          />
        </div>
        
        <Button
          onClick={generateNewCode}
          className="w-full"
          disabled={loading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {loading ? "Generating..." : "Generate New Code"}
        </Button>
        
        {generatedCode && (
          <div className="mt-4 border rounded-md p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Registration Code:</p>
                <p className="text-lg font-mono">{generatedCode}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Valid for {expiryDays} days
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p>Share this code with new employees to register on the system.</p>
          <p className="mt-1">Registration codes can only be used once.</p>
        </div>
      </CardContent>
    </Card>
  );
}
