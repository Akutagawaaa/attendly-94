
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { buttonVariants } from "@/components/ui/button-custom";
import { cn } from "@/lib/utils";
import { LogOut, UserCircle, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ButtonCustom } from "@/components/ui/button-custom";

export default function Header() {
  const { user, logout, isAdmin, updateOrganizationLogo } = useAuth();
  const location = useLocation();
  const [logoUrl, setLogoUrl] = useState("");
  const [logoDialogOpen, setLogoDialogOpen] = useState(false);
  
  // Active link styles
  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };
  
  const linkClass = "text-sm font-medium transition-colors hover:text-primary relative py-2";
  const activeLinkClass = "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full";
  
  const handleLogoUpdate = () => {
    if (logoUrl.trim()) {
      updateOrganizationLogo(logoUrl);
      setLogoDialogOpen(false);
    }
  };
  
  return (
    <header className="border-b backdrop-blur-md bg-background/80 fixed top-0 w-full z-10 transition-all duration-200">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8 mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden bg-gradient-to-br from-primary/90 to-primary rounded-md flex items-center justify-center shadow-sm">
            {user?.organizationLogo ? (
              <img 
                src={user.organizationLogo} 
                alt="Organization Logo" 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-white font-medium text-lg">AT</span>
            )}
          </div>
          <span className="text-xl font-semibold tracking-tight">Attendly</span>
        </div>
        
        {/* Navigation */}
        {user && (
          <nav className="mx-6 hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className={cn(linkClass, isLinkActive("/dashboard") && activeLinkClass)}
            >
              Dashboard
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(linkClass, isLinkActive("/admin") && activeLinkClass)}
              >
                Admin Panel
              </Link>
            )}
          </nav>
        )}
        
        {/* User Menu or Login Button */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-5 w-5" />
                    )}
                  </div>
                  <span className="font-medium hidden sm:inline-block">
                    {user.name}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 animate-fade-in-up">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                {isAdmin && (
                  <>
                    <DropdownMenuItem onClick={() => setLogoDialogOpen(true)}>
                      <Upload className="mr-2 h-4 w-4" />
                      <span>Update Organization Logo</span>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "animate-fade-in transition-all duration-200"
              )}
            >
              Log In
            </Link>
          )}
        </div>
      </div>
      
      {/* Logo Upload Dialog */}
      <Dialog open={logoDialogOpen} onOpenChange={setLogoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Organization Logo</DialogTitle>
            <DialogDescription>
              Enter the URL of your organization's logo
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="logo-url">Logo URL</Label>
              <Input
                id="logo-url"
                placeholder="https://example.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full"
              />
            </div>
            {logoUrl && (
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-md overflow-hidden border">
                  <img 
                    src={logoUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Error';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <ButtonCustom
              type="button" 
              variant="outline"
              onClick={() => setLogoDialogOpen(false)}
            >
              Cancel
            </ButtonCustom>
            <ButtonCustom type="button" onClick={handleLogoUpdate}>
              Update Logo
            </ButtonCustom>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
