import { useState } from 'react'

type Props = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  priority?: boolean
  position?: string
  slot?: string
}

/**
 * Photograph slot. Drop the real file in /public/images and it renders;
 * until then an honest studio-dark placeholder is shown (never a fake car).
 */
export function Photo({ src, alt, className = '', imgClassName = '', priority, position = 'center', slot }: Props) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`relative overflow-hidden bg-graphite ${className}`}>
      {failed ? (
        <div className="absolute inset-0" role="img" aria-label={alt}>
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(120% 80% at 70% 30%, #262626 0%, #121212 55%, #0a0a0a 100%)' }}
          />
          <div className="absolute inset-x-0 bottom-[28%] h-px bg-white/10" />
          <span className="mono absolute left-4 bottom-4 text-steel/80">FOTO · {slot ?? src}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
          style={{ objectPosition: position }}
        />
      )}
    </div>
  )
}
