
import LoginForm from "@/components/auth/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10%] opacity-50">
          <div 
            className="absolute top-1/2 left-1/2 w-[40%] aspect-square rounded-full bg-primary/10 blur-3xl -translate-x-1/2 -translate-y-1/2"
            style={{ animation: "pulse 8s ease-in-out infinite alternate" }}
          ></div>
          <div 
            className="absolute bottom-1/4 right-1/4 w-[30%] aspect-square rounded-full bg-blue-300/10 blur-3xl"
            style={{ animation: "pulse 10s ease-in-out infinite alternate-reverse" }}
          ></div>
        </div>
      </div>
      
      <div className="w-full max-w-md animate-fade-in-up relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="relative h-16 w-16 overflow-hidden bg-gradient-to-br from-primary/90 to-primary rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <span className="text-white font-medium text-3xl">WP</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">WorkPulse</h1>
          <p className="text-muted-foreground mt-1">HR & Employee Management</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
