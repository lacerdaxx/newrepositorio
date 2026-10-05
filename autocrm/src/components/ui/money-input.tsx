"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const fmt = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

/** Valor em reais (inteiro): exibe 129.900 enquanto digita; emite number | null. */
export const MoneyInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
    value: number | null | undefined;
    onChange: (v: number | null) => void;
  }
>(({ value, onChange, className, ...props }, ref) => (
  <div
    className={cn(
      "flex h-9 items-center rounded-lg border border-input bg-surface shadow-xs transition-[border-color,box-shadow] focus-within:border-[color-mix(in_oklch,var(--brand)_55%,var(--border-strong))] focus-within:ring-[3px] focus-within:ring-ring",
      className,
    )}
  >
    <span className="pl-3 text-sm text-subtle-foreground">R$</span>
    <input
      ref={ref}
      inputMode="numeric"
      value={value === null || value === undefined ? "" : fmt.format(value)}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
        onChange(digits ? Number(digits) : null);
      }}
      className="h-full w-full min-w-0 bg-transparent px-2 text-sm tabular outline-none placeholder:text-subtle-foreground"
      {...props}
    />
  </div>
));
MoneyInput.displayName = "MoneyInput";
