import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius)] text-xs font-mono font-normal leading-[18px] tracking-[1.92px] uppercase no-underline cursor-pointer transition-all duration-200 border border-transparent disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white border-primary hover:bg-[#e05e00] hover:border-[#e05e00]",
        outline: "bg-transparent text-foreground border-border hover:border-[#444] hover:text-white",
        ghost: "bg-transparent text-muted-foreground hover:text-white",
        active: "bg-transparent text-primary border-primary",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, href, children, ...props }, ref) => {
    const combinedClassName = cn(buttonVariants({ variant, className }));

    if (href) {
      return (
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <button className={combinedClassName} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
