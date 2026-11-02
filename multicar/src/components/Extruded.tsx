import type { CSSProperties } from 'react'

type Props = {
  text: string
  tone?: 'metal' | 'ember'
  /** Extrusion depth in steps (1 step ≈ 0.007em). */
  depth?: number
  className?: string
  as?: 'span' | 'div'
}

const cache = new Map<string, string>()

function extrusion(depth: number, tone: 'metal' | 'ember') {
  const key = `${depth}-${tone}`
  const hit = cache.get(key)
  if (hit) return hit
  const [a, b] = tone === 'ember' ? [[122, 47, 11], [64, 24, 6]] : [[58, 58, 58], [14, 14, 14]]
  const layers: string[] = []
  for (let i = 1; i <= depth; i++) {
    const t = i / depth
    const c = a.map((v, k) => Math.round(v + (b[k] - v) * t)).join(',')
    layers.push(`${(i * 0.0045).toFixed(4)}em ${(i * 0.0072).toFixed(4)}em 0 rgb(${c})`)
  }
  const out = layers.join(',')
  cache.set(key, out)
  return out
}

/**
 * Physical-looking type: a metallic (or ember) face over a stepped extrusion
 * with a single contact shadow. The back layer is decorative only.
 */
export function Extruded({ text, tone = 'metal', depth = 22, className = '', as: Tag = 'span' }: Props) {
  const style = { '--x3d-extrude': extrusion(depth, tone) } as CSSProperties
  return (
    <Tag className={`x3d ${tone === 'ember' ? 'ember' : ''} ${className}`} style={style}>
      <span className="x3d-back" aria-hidden="true">{text}</span>
      <span className="x3d-face">{text}</span>
    </Tag>
  )
}
