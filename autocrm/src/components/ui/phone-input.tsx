"use client";
import * as React from "react";
import { Input } from "./input";

/** Máscara (61) 99999-9999 enquanto digita. */
export function maskPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("55") && d.length > 11) d = d.slice(2);
  d = d.slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export const PhoneInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
    value: string;
    onChange: (v: string) => void;
  }
>(({ value, onChange, ...props }, ref) => (
  <Input
    ref={ref}
    inputMode="tel"
    autoComplete="tel"
    placeholder="(61) 99999-9999"
    value={maskPhone(value)}
    onChange={(e) => onChange(maskPhone(e.target.value))}
    {...props}
  />
));
PhoneInput.displayName = "PhoneInput";
