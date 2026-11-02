import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsMobile, useReducedMotion } from './useEnv'

gsap.registerPlugin(ScrollTrigger)

/**
 * Animações ligadas ao scroll (GSAP ScrollTrigger).
 *  [data-reveal]        → entra com rotação 3D + deslocamento
 *  [data-parallax="n"]  → desloca em Y proporcional ao scroll (n = intensidade)
 *  [data-depth-bg]      → fundo com leve zoom/profundidade
 */
export function useScrollFx() {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 60, rotateX: mobile ? 0 : -18, transformPerspective: 900, transformOrigin: '50% 100%',
          duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const k = parseFloat(el.dataset.parallax || '0.1') * (mobile ? 0.4 : 1)
        gsap.to(el, {
          yPercent: -k * 100, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-depth-bg]').forEach((el) => {
        gsap.fromTo(el, { scale: 1 }, {
          scale: 1.18, ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })
    return () => ctx.revert()
  }, [reduced, mobile])
}
