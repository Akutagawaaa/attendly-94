
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Logo } from "@/components/ui/logo";

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo className="h-12 w-12" />
          <h1 className="text-3xl font-bold">Attendly</h1>
          <p className="text-sm text-muted-foreground">
            Employee Attendance Management System
          </p>
        </div>
        
        <div className="border rounded-lg p-6 bg-card shadow">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
