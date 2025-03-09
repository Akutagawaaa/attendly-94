
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Upload, Image, RefreshCw, Trash2 } from "lucide-react";

export default function OrganizationLogo() {
  const { user, updateOrganizationLogo } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG and SVG files are allowed");
      return;
    }
    
    setIsUploading(true);
    
    // In a real application, you would upload the file to your server
    // For this demo, we'll use the FileReader API to convert to data URL
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Update user profile with new logo URL
        updateOrganizationLogo(reader.result);
        toast.success("Organization logo updated successfully");
      }
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      toast.error("Failed to upload logo");
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleRemoveLogo = () => {
    updateOrganizationLogo("");
    toast.success("Organization logo removed");
  };
  
  if (!user || user.role !== "admin") return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Organization Logo</CardTitle>
        <CardDescription>
          Upload your organization's logo to display on dashboard and reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          {user.organizationLogo ? (
            <div className="relative group">
              <img 
                src={user.organizationLogo}
                alt="Organization logo"
                className="h-32 w-32 object-contain border rounded-lg p-2"
              />
              <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white"
                  onClick={handleUploadClick}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Change
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white"
                  onClick={handleRemoveLogo}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="h-32 w-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={handleUploadClick}
            >
              <Image className="h-8 w-8 mb-2" />
              <p className="text-sm text-center">Upload logo</p>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/svg+xml"
            className="hidden"
          />
        </div>
        
        <Button
          className="w-full"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {user.organizationLogo ? "Change Logo" : "Upload Logo"}
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Recommended size: 512x512 pixels. Maximum file size: 5MB.
          Supported formats: JPEG, PNG, SVG.
        </p>
      </CardContent>
    </Card>
  );
}
