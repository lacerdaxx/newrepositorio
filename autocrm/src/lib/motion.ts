import type { Transition, Variants } from "framer-motion";

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const transition = {
  fast: { duration: 0.18, ease: EASE_OUT } satisfies Transition,
  base: { duration: 0.26, ease: EASE_OUT } satisfies Transition,
  spring: { type: "spring", stiffness: 420, damping: 36, mass: 0.8 } satisfies Transition,
  drawer: { type: "spring", stiffness: 360, damping: 38 } satisfies Transition,
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  enter: { opacity: 1, y: 0, transition: transition.base },
  exit: { opacity: 0, y: -4, transition: transition.fast },
};

export const staggerContainer = (stagger = 0.04, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: transition.base },
};
