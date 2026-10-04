"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Card glass com elevação no hover, borda que acende e brilho seguindo o cursor. */
export default function SpotlightCard({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "li" }) {
  const onMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  }, []);
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onPointerMove={onMove}
      className={cn("spotlight glass rounded-2xl transition-colors duration-300", className)}
    >
      {children}
    </Comp>
  );
}
