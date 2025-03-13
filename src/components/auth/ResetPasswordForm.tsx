
import { useState, useEffect } from "react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { passwordService } from "@/services/passwordService";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !email) {
        setTokenValid(false);
        return;
      }
      
      try {
        const isValid = await passwordService.validateResetToken(token, email);
        setTokenValid(isValid);
        
        if (!isValid) {
          toast.error("Invalid or expired reset link");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setTokenValid(false);
        toast.error("Failed to validate reset token");
      }
    };
    
    validateToken();
  }, [token, email]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const success = await passwordService.resetPassword(email, token, password);
      
      if (success) {
        toast.success("Password changed successfully");
        navigate("/login");
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (tokenValid === null) {
    return (
      <div className="space-y-4 text-center">
        <p>Validating reset link...</p>
      </div>
    );
  }
  
  if (tokenValid === false) {
    return (
      <div className="space-y-4 text-center">
        <h3 className="text-lg font-medium">Invalid Reset Link</h3>
        <p className="text-sm text-muted-foreground">
          This password reset link is invalid or has expired.
        </p>
        <a href="/login" className="text-primary hover:underline">
          Go back to login
        </a>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          Create a new password for your account
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              data-testid="password-input"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              data-testid="confirm-password-input"
            />
          </div>
        </div>
        
        <ButtonCustom
          type="submit"
          className="w-full"
          loading={isSubmitting}
          data-testid="reset-password-button"
        >
          Reset Password
        </ButtonCustom>
      </form>
    </div>
  );
}
