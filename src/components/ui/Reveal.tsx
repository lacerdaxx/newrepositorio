"use client";

import { motion } from "framer-motion";
import { fadeUp, inView, stagger } from "@/lib/motion";

/** Fade-up ao entrar na viewport. */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Container que escalona a entrada dos filhos <RevealItem>. */
export function RevealGroup({ children, className, gap = 0.08, as = "div" }: { children: React.ReactNode; className?: string; gap?: number; as?: "div" | "ul" | "ol" }) {
  const Comp = as === "ul" ? motion.ul : as === "ol" ? motion.ol : motion.div;
  return (
    <Comp className={className} variants={stagger(gap)} {...inView}>
      {children}
    </Comp>
  );
}

export function RevealItem({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "li" }) {
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp className={className} variants={fadeUp}>
      {children}
    </Comp>
  );
}
