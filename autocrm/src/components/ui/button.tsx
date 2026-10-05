import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out",
    "focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-brand text-brand-foreground shadow-sm hover:bg-[color-mix(in_oklch,var(--brand)_88%,black)] inset-ring inset-ring-white/10",
        secondary:
          "surface border border-border bg-surface text-foreground shadow-xs hover:bg-accent hover:border-border-strong",
        outline: "border border-border bg-transparent hover:bg-accent hover:border-border-strong",
        ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
        destructive: "bg-danger text-white shadow-sm hover:bg-[color-mix(in_oklch,var(--danger)_88%,black)]",
        whatsapp: "bg-whatsapp text-[#04210f] shadow-sm hover:bg-[color-mix(in_oklch,var(--whatsapp)_90%,black)]",
        link: "text-brand underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        sm: "h-8 px-3 text-[13px]",
        default: "h-9 px-3.5",
        lg: "h-10 px-5",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-xs": "size-7 rounded-md [&_svg]:size-3.5",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";
