
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { User, Edit, Save, X, Upload, MapPin, Building, BadgeCheck, Phone, Briefcase, Copy } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfileCard() {
  const { user, updateProfile, updateAvatar, updateUserStatus } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    designation: user?.designation || "",
    phone: user?.phone || "",
    address: user?.address || "",
    status: user?.status || "available",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, you would update the user data in your API/database
      // await api.put('/users/profile', formData);
      
      updateProfile({
        name: formData.name,
        department: formData.department,
        designation: formData.designation,
        phone: formData.phone,
        address: formData.address,
      });

      updateUserStatus(formData.status as any);
      
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      department: user?.department || "",
      designation: user?.designation || "",
      phone: user?.phone || "",
      address: user?.address || "",
      status: user?.status || "available",
    });
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Normally you would upload this to a server
    // For this demo, we'll use a local URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateAvatar(reader.result);
        toast.success("Profile picture updated");
      }
    };
    reader.readAsDataURL(file);
  };

  const copyEmployeeId = () => {
    if (user?.employeeId) {
      navigator.clipboard.writeText(user.employeeId);
      toast.success("Employee ID copied to clipboard");
    }
  };

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base font-medium">Profile Information</CardTitle>
            <CardDescription>View and update your profile</CardDescription>
          </div>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Avatar 
                className="h-24 w-24 cursor-pointer border-2 border-primary/20"
                onClick={handleAvatarClick}
              >
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-lg bg-primary/10">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 border-2 border-background">
                  <Upload className="h-4 w-4 text-white" />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="font-medium">{user.name}</p>
              <div className="flex items-center gap-1 justify-center">
                <p className="text-sm text-muted-foreground">{user.department}</p>
                <span className="mx-1">•</span>
                <div className={`h-2 w-2 rounded-full ${
                  user.status === 'available' ? 'bg-green-500' : 
                  user.status === 'busy' ? 'bg-red-500' : 
                  user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}></div>
                <span className="text-xs capitalize">{user.status}</span>
              </div>
            </div>
            
            <div className="flex items-center mt-2 text-xs bg-muted px-3 py-1.5 rounded-full">
              <BadgeCheck className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span className="font-medium mr-1.5">{user.employeeId}</span>
              <button 
                onClick={copyEmployeeId}
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Copy ID"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                readOnly={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={true}
                  className="bg-muted pl-9"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative">
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`${!isEditing ? "bg-muted" : ""} pl-9`}
                  />
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="designation">Designation</Label>
                <div className="relative">
                  <Input
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`${!isEditing ? "bg-muted" : ""} pl-9`}
                  />
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`${!isEditing ? "bg-muted" : ""} pl-9`}
                    placeholder={!isEditing && !formData.phone ? "Not provided" : ""}
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                {isEditing ? (
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="away">Away</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center h-10 px-3 bg-muted rounded-md">
                    <div className={`h-2 w-2 rounded-full mr-2 ${
                      formData.status === 'available' ? 'bg-green-500' : 
                      formData.status === 'busy' ? 'bg-red-500' : 
                      formData.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="capitalize">{formData.status}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`${!isEditing ? "bg-muted" : ""} pl-9`}
                  placeholder={!isEditing && !formData.address ? "Not provided" : ""}
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
