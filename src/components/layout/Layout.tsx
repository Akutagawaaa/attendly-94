
import React from "react";
import Header from "./Header";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-1 bg-gray-50 relative overflow-x-hidden">
        {/* Organization logo watermark for admin users */}
        {user?.role === "admin" && user?.organizationLogo && (
          <div className="fixed right-6 bottom-28 opacity-30 pointer-events-none">
            <img 
              src={user.organizationLogo} 
              alt="Organization logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
        )}
        
        {/* Added pt-20 to create space below the header */}
        <main className="relative z-10 pb-28 pt-20">
          {children}
        </main>
      </div>
      
      <footer className="py-4 px-8 border-t bg-white fixed bottom-0 w-full z-20">
        <div className="container flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2 rounded bg-primary flex items-center justify-center">
              <span className="text-white font-medium text-sm">AT</span>
            </div>
            <span className="text-sm text-muted-foreground">Attendly © {new Date().getFullYear()}</span>
          </div>
          
          {user && (
            <div className="flex items-center">
              <div className="mr-2">
                <p className="text-xs text-right font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">ID: {user.employeeId}</p>
              </div>
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="text-xs">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
