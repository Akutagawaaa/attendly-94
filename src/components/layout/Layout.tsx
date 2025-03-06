
import React from "react";
import Header from "./Header";
import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  
  // Determine if we should show the header based on the current route
  const isLoginPage = location.pathname === "/login";
  
  // Check if the layout should have padding-top (for pages with header)
  const shouldHavePaddingTop = !isLoginPage;
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {!isLoginPage && <Header />}
      
      <main 
        className={`flex-1 flex flex-col ${shouldHavePaddingTop ? "pt-16" : ""}`}
      >
        <div className="animate-fade-in-up">
          {children}
        </div>
      </main>
      
      <Toaster />
      <Sonner />
    </div>
  );
}
