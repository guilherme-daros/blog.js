import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
  <div className={cn("bg-card border border-border rounded-[var(--radius)] overflow-hidden", className)}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = "" }: CardProps) => (
  <div className={cn("p-4 px-6 border-b border-border", className)}>
    {children}
  </div>
);

export const CardBody = ({ children, className = "" }: CardProps) => (
  <div className={cn("p-6", className)}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = "" }: CardProps) => (
  <div className={cn("p-4 px-6 border-t border-border bg-panel", className)}>
    {children}
  </div>
);
