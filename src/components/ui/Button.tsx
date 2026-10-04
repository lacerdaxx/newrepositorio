"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
  arrow?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  target?: string;
};

const base =
  "group relative inline-flex min-h-[52px] items-center justify-center gap-2 overflow-hidden rounded-xl px-6 text-[15px] font-semibold tracking-[-0.01em] transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:px-7 sm:text-base";

const styles = {
  primary: "bg-gold text-[#140d00] shadow-[0_10px_40px_-10px_rgba(247,181,44,0.55)]",
  outline: "border border-white/15 bg-white/[0.02] text-ink hover:border-gold/60 hover:bg-white/[0.05]",
};

export default function Button({ href, onClick, children, variant = "primary", className, arrow, type = "button", disabled, target }: Props) {
  const content = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/55 to-transparent"
        />
      )}
      <span className="relative">{children}</span>
      {arrow && <ArrowRight aria-hidden className="relative h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />}
    </>
  );
  const motionProps = { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 } };

  if (href) {
    return (
      <motion.a
        href={href}
        onClick={onClick}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={cn(base, styles[variant], className)}
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }
  return (
    <motion.button type={type} onClick={onClick} disabled={disabled} className={cn(base, styles[variant], className)} {...motionProps}>
      {content}
    </motion.button>
  );
}
