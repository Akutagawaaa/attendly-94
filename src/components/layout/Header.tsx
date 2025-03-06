
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { buttonVariants } from "@/components/ui/button-custom";
import { cn } from "@/lib/utils";
import { LogOut, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  
  // Active link styles
  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };
  
  const linkClass = "text-sm font-medium transition-colors hover:text-primary relative py-2";
  const activeLinkClass = "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full";
  
  return (
    <header className="border-b backdrop-blur-md bg-background/80 fixed top-0 w-full z-10 transition-all duration-200">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8 mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden bg-gradient-to-br from-primary/90 to-primary rounded-md flex items-center justify-center shadow-sm">
            <span className="text-white font-medium text-lg">HR</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">WorkPulse</span>
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
    </header>
  );
}
