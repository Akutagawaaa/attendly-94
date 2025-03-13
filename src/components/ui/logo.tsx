
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "small";
}

export function Logo({ variant = "default", className, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <img 
        src="/assets/logo.png" 
        alt="Attendly Logo" 
        className={cn(
          "object-contain",
          variant === "default" ? "h-10 w-10" : "h-6 w-6"
        )} 
      />
    </div>
  );
}
