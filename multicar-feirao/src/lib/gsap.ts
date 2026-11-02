import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
export const MQ_MOTION = '(prefers-reduced-motion: no-preference)'
export const MQ_DESKTOP = '(min-width: 1024px)'
