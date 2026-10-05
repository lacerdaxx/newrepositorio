"use client";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageVariants } from "@/lib/motion";

/** Fade + leve slide a cada navegação. Respeita prefers-reduced-motion. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={pathname}
      variants={pageVariants}
      initial={reduce ? false : "initial"}
      animate="enter"
      className="flex min-h-0 flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
