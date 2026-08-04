import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, label, error, ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={props.id}
            className="block font-mono text-[11px] uppercase tracking-[1px] text-muted-foreground mb-2"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          className="font-mono text-sm tracking-[-0.017em] text-foreground bg-background border border-border rounded-[var(--radius)] px-4 h-10 w-full outline-none transition-colors duration-200 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          ref={ref}
          {...props}
        />
        {error && (
          <span className="font-mono text-xs text-destructive mt-1 block">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
