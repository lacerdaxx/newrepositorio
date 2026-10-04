"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import Logo from "./ui/Logo";
import { cn } from "@/lib/cn";

export default function Header({ logoSrc }: { logoSrc: string }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 12));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled ? "border-white/[0.08] bg-[#0A0A0A]/75 backdrop-blur-xl" : "border-transparent bg-transparent",
      )}
    >
      <div className="container-site flex h-16 items-center justify-between md:h-20">
        <a href="#topo" aria-label="BuildScale Company — início" className="shrink-0">
          <Logo src={logoSrc} priority className="h-7 sm:h-8 md:h-9" />
        </a>
        <motion.a
          href="#diagnostico"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative inline-flex min-h-[44px] items-center overflow-hidden whitespace-nowrap rounded-lg bg-gold px-3.5 text-[13px] sm:text-sm font-semibold text-[#140d00] shadow-[0_8px_30px_-10px_rgba(247,181,44,0.6)] sm:min-h-[48px] sm:px-5"
        >
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/55 to-transparent" />
          <span className="relative">Diagnóstico gratuito</span>
        </motion.a>
      </div>
    </header>
  );
}
