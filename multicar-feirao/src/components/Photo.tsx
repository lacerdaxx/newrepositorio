import { useState, type ReactNode } from 'react'
import { PHOTOS, type PhotoKey } from '../data/content'

const WIDTHS = [640, 1200, 1920, 2560]
const srcset = (name: string, ext: string) => WIDTHS.map((w) => `/photos/${name}-${w}.${ext} ${w}w`).join(', ')

interface Props {
  photo: PhotoKey
  sizes: string
  eager?: boolean
  className?: string
  imgClassName?: string
  /** Mostrado quando o arquivo ainda não existe em public/photos/. */
  fallback: ReactNode
}

export function Photo({ photo, sizes, eager, className = '', imgClassName = '', fallback }: Props) {
  const [failed, setFailed] = useState(false)
  const p = PHOTOS[photo]
  if (failed) return <>{fallback}</>
  return (
    <picture className={`block h-full w-full ${className}`}>
      <source type="image/avif" srcSet={srcset(p.name, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(p.name, 'webp')} sizes={sizes} />
      <img
        src={`/photos/${p.name}-1200.webp`}
        alt={p.alt}
        width={p.w}
        height={p.h}
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </picture>
  )
}
