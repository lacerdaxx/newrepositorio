import type { CSSProperties } from 'react'

type Props = {
  children: string
  tone?: 'bone' | 'ember' | 'ink'
  /** camadas de extrusão */
  depth?: number
  /** cor lateral da extrusão */
  side?: string
  className?: string
  style?: CSSProperties
}

const SIDES = { bone: '#3a3733', ember: '#6e2a08', ink: '#8c8c8c' }

/**
 * Letras como objeto físico: face com acabamento metálico sutil + extrusão em camadas.
 * A direção da extrusão vem das variáveis --ex / --ey (o Hero as atualiza com o ponteiro).
 */
export default function Extruded({ children, tone = 'bone', depth = 10, side, className = '', style }: Props) {
  const c = side ?? SIDES[tone]
  const layers: string[] = []
  for (let i = 1; i <= depth; i++) {
    layers.push(`calc(var(--ex, 0.006em) * ${i}) calc(var(--ey, 0.011em) * ${i}) 0 ${c}`)
  }
  layers.push(
    `calc(var(--ex, 0.006em) * ${depth + 6}) calc(var(--ey, 0.011em) * ${depth + 8}) ${(depth * 0.02).toFixed(2)}em rgba(0,0,0,.65)`,
  )
  return (
    <span className={`x3d x3d--${tone} ${className}`} style={style}>
      <span className="x3d__side" aria-hidden="true" style={{ textShadow: layers.join(',') }}>
        {children}
      </span>
      <span className="x3d__face">{children}</span>
    </span>
  )
}
