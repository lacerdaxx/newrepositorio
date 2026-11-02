import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Coreografia da página. Tudo roda dentro de matchMedia: com prefers-reduced-motion
 * nada é escondido nem animado e o conteúdo aparece em seu estado final.
 */
export function initMotion(root: HTMLElement) {
  const mm = gsap.matchMedia(root)

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const q = gsap.utils.selector(root)

    // ABERTURA ------------------------------------------------------------
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.fromTo('[data-hero-photo]', { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.6, ease: 'expo.inOut' })
      .fromTo('[data-hero-cam]', { scale: 1.18 }, { scale: 1, duration: 2.8, ease: 'power3.out' }, 0)
      .from('[data-hero-fade]', { opacity: 0, y: 14, duration: 0.9, stagger: 0.12 }, 0.7)
      .from('[data-title-line]', { rotateX: -80, yPercent: 40, opacity: 0, duration: 1.4, stagger: 0.14 }, 0.8)
      .fromTo('[data-hero-rule]', { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'expo.inOut' }, 1.3)
      .from('[data-hero-offer]', { opacity: 0, z: -220, rotateX: 22, duration: 1.3 }, 1.7)

    // Câmera: parallax sutil da foto principal ao sair da dobra
    gsap.to('[data-hero-cam]', {
      yPercent: 7,
      ease: 'none',
      scrollTrigger: { trigger: '#topo', start: 'top top', end: 'bottom top', scrub: true },
    })

    // Elevação discreta de títulos e blocos
    q('[data-rise]').forEach((el) => {
      gsap.from(el, {
        y: 36,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    })

    // Números 3D: entram em profundidade
    q('[data-price]').forEach((el) => {
      gsap.from(el, {
        rotateX: -38,
        yPercent: 18,
        opacity: 0,
        transformOrigin: '50% 100%',
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })
    })

    // Oferta 02: o número desliza lateralmente com o scroll
    q('[data-slide]').forEach((el) => {
      gsap.fromTo(el, { xPercent: 6 }, {
        xPercent: -4,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })

    // Transição entre ofertas: o painel claro abre como uma máscara
    q('[data-wipe]').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(14% 8% 0% 8%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 15%', scrub: true },
      })
    })

    // Fotografias do showroom: máscara de entrada + parallax interno
    q('[data-mask]').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.5,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })
      const inner = el.querySelector('[data-parallax]')
      if (inner) {
        gsap.fromTo(inner, { yPercent: -5 }, {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      }
    })
  })

  return () => mm.revert()
}
