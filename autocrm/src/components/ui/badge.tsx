import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium leading-none whitespace-nowrap [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-muted-foreground",
        brand: "border-transparent bg-[color-mix(in_oklch,var(--brand)_14%,transparent)] text-brand",
        success: "border-transparent bg-[color-mix(in_oklch,var(--success)_14%,transparent)] text-success",
        warning: "border-transparent bg-[color-mix(in_oklch,var(--warning)_18%,transparent)] text-warning",
        danger: "border-transparent bg-[color-mix(in_oklch,var(--danger)_14%,transparent)] text-danger",
        info: "border-transparent bg-[color-mix(in_oklch,var(--info)_14%,transparent)] text-info",
        outline: "border-border text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
