
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AtSign, KeySquare } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

export default function OTPForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { loginWithOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();
  
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate email
      const validatedEmail = emailSchema.parse(email);
      setEmailError("");
      
      setIsSubmittingEmail(true);
      await loginWithOTP(validatedEmail);
      setOtpSent(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
      console.error(error);
    } finally {
      setIsSubmittingEmail(false);
    }
  };
  
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    
    try {
      setIsVerifyingOTP(true);
      await verifyOTP(email, otp);
      toast.success("OTP verified successfully");
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to verify OTP. Please try again.");
      }
      console.error(error);
    } finally {
      setIsVerifyingOTP(false);
    }
  };
  
  return (
    <div className="w-full max-w-md space-y-6 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">OTP Login</h1>
        <p className="text-sm text-muted-foreground">
          {otpSent ? "Enter the OTP sent to your email" : "Enter your email to receive an OTP"}
        </p>
      </div>
      
      {!otpSent ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 ${emailError ? "border-destructive" : ""}`}
                data-testid="email-input"
              />
            </div>
            {emailError && (
              <p className="text-xs text-destructive">{emailError}</p>
            )}
          </div>
          
          <ButtonCustom
            type="submit"
            className="w-full"
            loading={isSubmittingEmail}
            data-testid="send-otp-button"
          >
            Send OTP
          </ButtonCustom>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <KeySquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter OTP"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="pl-10"
                data-testid="otp-input"
                maxLength={6}
              />
            </div>
          </div>
          
          <ButtonCustom
            type="submit"
            className="w-full"
            loading={isVerifyingOTP}
            data-testid="verify-otp-button"
          >
            Verify OTP
          </ButtonCustom>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="text-sm text-primary hover:underline"
            >
              Change email
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
