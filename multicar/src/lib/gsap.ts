import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/** Runs `setup` only when the visitor has not asked for reduced motion. */
export function whenMotionOk(scope: Element | null, setup: () => void | (() => void)) {
  const mm = gsap.matchMedia(scope ?? undefined)
  mm.add('(prefers-reduced-motion: no-preference)', setup)
  return () => mm.revert()
}
