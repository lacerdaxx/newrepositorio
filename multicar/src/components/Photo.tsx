import { useState } from 'react'

type Props = {
  name: string
  w: number
  h: number
  alt: string
  eager?: boolean
  className?: string
  /** objeto-posição CSS */
  position?: string
}

/**
 * Fotografia com .webp + .jpg. Se o arquivo ainda não existir em /public/photos,
 * mostra um fundo de estúdio neutro identificando qual arquivo falta (nunca uma imagem falsa).
 */
export default function Photo({ name, w, h, alt, eager, className = '', position = 'center' }: Props) {
  const [failed, setFailed] = useState(false)
  const base = `${import.meta.env.BASE_URL}photos/${name}`

  if (failed) {
    return (
      <div
        className={`photo-slot relative flex items-end p-4 ${className}`}
        role="img"
        aria-label={alt}
        data-missing-photo={name}
      >
        <span className="mono text-[0.62rem] text-steel/70">Foto pendente — public/photos/{name}.jpg</span>
      </div>
    )
  }

  return (
    <picture>
      <source type="image/webp" srcSet={`${base}.webp`} />
      <img
        src={`${base}.jpg`}
        width={w}
        height={h}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding={eager ? 'sync' : 'async'}
        {...(eager ? { fetchPriority: 'high' as const } : {})}
        onError={() => setFailed(true)}
        className={className}
        style={{ objectPosition: position }}
      />
    </picture>
  )
}
