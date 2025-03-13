
import { useState } from "react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Input } from "@/components/ui/input";
import { AtSign } from "lucide-react";
import { toast } from "sonner";
import { passwordService } from "@/services/passwordService";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const success = await passwordService.requestPasswordReset(email);
      
      if (success) {
        setSubmitted(true);
        toast.success("Password reset instructions sent to your email");
      } else {
        toast.error("Email not found in our system");
      }
    } catch (error) {
      toast.error("Failed to process password reset request");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <h3 className="text-lg font-medium">Check your email</h3>
        <p className="text-sm text-muted-foreground">
          We've sent password reset instructions to {email}
        </p>
        <p className="text-xs text-muted-foreground">
          If you don't see the email, check your spam folder
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to receive password reset instructions
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              data-testid="email-input"
            />
          </div>
        </div>
        
        <ButtonCustom
          type="submit"
          className="w-full"
          loading={isSubmitting}
          data-testid="reset-password-button"
        >
          Send Reset Instructions
        </ButtonCustom>
      </form>
      
      <div className="text-center">
        <a href="/login" className="text-sm text-primary hover:underline">
          Back to login
        </a>
      </div>
    </div>
  );
}
