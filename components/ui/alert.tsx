import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-[var(--radius)] border p-3 text-sm font-mono",
  {
    variants: {
      variant: {
        default: "bg-surface text-foreground border-border",
        destructive: "bg-destructive/10 border-destructive text-destructive",
        success: "bg-[#16a34a]/10 border-[#16a34a]/20 text-[#16a34a]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

export { Alert };
