"use client";

import { motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import { useId } from "react";
import { cn } from "@/lib/cn";

type Props = {
  bars?: number;
  className?: string;
  /** "mount" anima ao carregar; "view" anima ao entrar na tela */
  trigger?: "mount" | "view";
  delay?: number;
};

/**
 * Barras verticais crescentes (prata → amarelo) com seta para cima,
 * inspiradas no ícone do logo. Puramente decorativo.
 */
export default function GrowthBars({ bars = 7, className, trigger = "mount", delay = 0.2 }: Props) {
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const W = 100;
  const H = 100;
  const gap = 3;
  const bw = (W - gap * (bars - 1)) / bars;
  const heights = Array.from({ length: bars }, (_, i) => 22 + (i * (H - 34)) / Math.max(1, bars - 1));
  const last = bars - 1;
  const ax = last * (bw + gap) + bw / 2;
  const top = H - heights[last];

  const animProps = (custom: TargetAndTransition, to: TargetAndTransition) =>
    reduce
      ? { initial: false as const }
      : trigger === "mount"
        ? { initial: custom, animate: to }
        : { initial: custom, whileInView: to, viewport: { once: true, amount: 0.3 } };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax meet" aria-hidden className={cn("overflow-visible", className)}>
      <defs>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E5E5E5" />
          <stop offset="1" stopColor="#8A8A8A" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7B52C" />
          <stop offset="1" stopColor="#F29A1E" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {heights.map((h, i) => {
        const gold = i >= bars - 2;
        return (
          <motion.rect
            key={i}
            x={i * (bw + gap)}
            y={H - h}
            width={bw}
            height={h}
            rx={0.8}
            fill={`url(#${gold ? "g" : "s"}${id})`}
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
            {...animProps({ scaleY: 0 }, { scaleY: 1, transition: { duration: 0.9, delay: delay + i * 0.09, ease: [0.22, 1, 0.36, 1] } })}
          />
        );
      })}
      <motion.path
        d={`M${ax} ${top - 16} L${ax + 6} ${top - 8} L${ax + 2.2} ${top - 8} L${ax + 2.2} ${top - 2} L${ax - 2.2} ${top - 2} L${ax - 2.2} ${top - 8} L${ax - 6} ${top - 8} Z`}
        fill="#F7B52C"
        {...animProps(
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, transition: { duration: 0.7, delay: delay + bars * 0.09 + 0.5, ease: [0.22, 1, 0.36, 1] } },
        )}
      />
    </svg>
  );
}

/** Divisor entre seções: linha fina + mini-barras. */
export function BarsDivider() {
  return (
    <div aria-hidden className="container-site flex items-end gap-4 opacity-70">
      <span className="mb-[3px] h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-white/15" />
      <GrowthBars bars={4} trigger="view" delay={0} className="h-8 w-10" />
      <span className="mb-[3px] h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-white/15" />
    </div>
  );
}
