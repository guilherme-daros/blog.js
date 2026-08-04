import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius)] border px-2.5 py-0.5 font-mono text-[10px] font-normal uppercase tracking-[1px] transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "border-border bg-panel text-muted-foreground",
        primary: "border-[#ff6b00]/30 bg-[#ff6b00]/5 text-[#ff6b00] hover:bg-[#ff6b00]/10 hover:border-[#ff6b00]/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
