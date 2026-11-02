import type { CSSProperties, ReactNode } from 'react'

type Tone = 'steel' | 'orange' | 'ink'
type Face = 'metal' | 'bone' | 'brand' | 'ink'

// Cores da lateral extrudada: da face (claro) até o fundo (escuro).
const SIDE: Record<Tone, [string, string]> = {
  steel: ['#4d4d4d', '#0a0a0a'],
  orange: ['#a8440f', '#2a1006'],
  ink: ['#3a3a3a', '#000000'],
}

const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const [r1, g1, b1] = p(a)
  const [r2, g2, b2] = p(b)
  const m = (x: number, y: number) => Math.round(x + (y - x) * t)
  return `rgb(${m(r1, r2)},${m(g1, g2)},${m(b1, b2)})`
}

interface Props {
  children: ReactNode
  tone?: Tone
  face?: Face
  /** camadas da extrusão (mais = mais profundidade/custo) */
  layers?: number
  /** espessura de cada camada em em */
  step?: number
  className?: string
  style?: CSSProperties
}

/** Texto como objeto físico: face com acabamento + camadas empilhadas em Z. */
export function Extrude({ children, tone = 'steel', face = 'metal', layers = 14, step = 0.016, className = '', style }: Props) {
  const [from, to] = SIDE[tone]
  return (
    <span className={`extrude ${className}`} style={{ ...style, ['--step' as string]: `${step}em` }}>
      <span className="extrude-stage">
        {Array.from({ length: layers }, (_, k) => k + 1).map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className="extrude-layer"
            style={{ ['--i' as string]: i, ['--c' as string]: mix(from, to, i / layers) }}
          >
            {children}
          </span>
        ))}
        <span className={`extrude-face face-${face}`}>{children}</span>
      </span>
    </span>
  )
}
