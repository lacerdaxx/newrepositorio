"use client";
import { motion } from "framer-motion";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Estado vazio ilustrado: ícone em "pilha" de cartões + título + CTA. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  /** elemento do ícone, ex.: <Kanban /> (serializável entre server/client) */
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition.base}
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-border-strong px-6 py-16 text-center",
        className,
      )}
    >
      <div className="brand-glow pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mb-5 h-16 w-20">
        <div className="absolute left-1/2 top-2 h-12 w-16 -translate-x-1/2 -rotate-6 rounded-xl border border-border bg-surface-2" />
        <div className="absolute left-1/2 top-1 h-12 w-16 -translate-x-1/2 rotate-3 rounded-xl border border-border bg-surface" />
        <motion.div
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...transition.spring, delay: 0.08 }}
          className="surface absolute left-1/2 top-0 flex h-12 w-16 -translate-x-1/2 items-center justify-center rounded-xl border border-border-strong bg-surface shadow-md"
        >
          <span className="text-brand [&_svg]:size-5">{icon}</span>
        </motion.div>
      </div>
      <h3 className="relative text-[15px] font-semibold tracking-tight">{title}</h3>
      {description && <p className="relative mt-1.5 max-w-sm text-sm text-muted-foreground text-balance">{description}</p>}
      {action && <div className="relative mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </motion.div>
  );
}
