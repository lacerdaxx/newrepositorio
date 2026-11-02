import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { scrollToForm } from '../../lib/scroll'

export function CtaButton({ children }: { children: string }) {
  const ref = useRef<HTMLButtonElement>(null)
  // movimento sutil de profundidade seguindo o cursor
  const move = (e: React.PointerEvent) => {
    const b = ref.current
    if (!b || e.pointerType !== 'mouse') return
    const r = b.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2
    b.style.transform = `perspective(500px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateZ(6px)`
  }
  const leave = () => { if (ref.current) ref.current.style.transform = '' }
  return (
    <button ref={ref} type="button" className="cta" onClick={scrollToForm} onPointerMove={move} onPointerLeave={leave}>
      <span className="relative">{children}</span>
      <ArrowRight size={18} className="relative" aria-hidden="true" />
    </button>
  )
}
