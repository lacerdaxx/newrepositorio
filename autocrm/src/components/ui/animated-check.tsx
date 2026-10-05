"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Checkbox redondo com traço animado ao concluir. */
export function AnimatedCheck({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative flex size-[18px] shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
        "focus-visible:ring-[3px] focus-visible:ring-ring",
        checked ? "border-success bg-success" : "border-border-strong hover:border-success",
        className,
      )}
    >
      <svg viewBox="0 0 16 16" className="size-3 text-white" fill="none">
        <motion.path
          d="M3.5 8.5l3 3 6-7"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {checked && (
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-success"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 0.45 }}
        />
      )}
    </button>
  );
}
