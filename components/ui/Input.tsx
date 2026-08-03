import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label
            className="block font-mono text-[11px] uppercase tracking-[1px] text-muted-foreground mb-2"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className="font-mono text-sm tracking-[-0.017em] text-foreground bg-background border border-border rounded-[var(--radius)] px-4 h-10 w-full outline-none transition-colors duration-200 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          {...props}
        />
        {error && (
          <p className="text-xs text-destructive mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
