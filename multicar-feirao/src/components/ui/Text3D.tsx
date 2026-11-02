import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useEnv'

type Variant = 'orange' | 'chrome' | 'white'

interface Props {
  text: string
  variant?: Variant
  className?: string
  delay?: number
  /** anima ao montar (hero) ou ao entrar na viewport */
  onView?: boolean
  sweep?: boolean
}

/** Texto com extrusão 3D em CSS, letras entrando individualmente em profundidade. */
export function Text3D({ text, variant = 'orange', className = '', delay = 0, onView = false, sweep = false }: Props) {
  const reduced = useReducedMotion()
  const words = text.split(' ')
  let idx = 0
  return (
    <span
      className={`inline-block font-display font-black uppercase leading-[0.95] ${sweep ? 'sweep' : ''} ${className}`}
      style={{ perspective: 800 }}
      aria-label={text}
    >
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
          {w.split('').map((ch) => {
            const i = idx++
            const anim = reduced
              ? {}
              : {
                  initial: { opacity: 0, y: 40, rotateX: -80, z: -200 },
                  ...(onView
                    ? { whileInView: { opacity: 1, y: 0, rotateX: 0, z: 0 }, viewport: { once: true, margin: '-60px' } }
                    : { animate: { opacity: 1, y: 0, rotateX: 0, z: 0 } }),
                  transition: { duration: 0.8, delay: delay + i * 0.04, ease: [0.2, 0.8, 0.2, 1] as const },
                }
            return (
              <motion.span key={i} className={`t3d-letter t3d-${variant}`} data-t={ch} {...anim}>
                <span className="t3d-face">{ch}</span>
              </motion.span>
            )
          })}
          {wi < words.length - 1 && <span className="inline-block w-[0.3em]" />}
        </span>
      ))}
    </span>
  )
}
