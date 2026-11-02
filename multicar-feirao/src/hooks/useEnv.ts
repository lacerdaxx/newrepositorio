import { useEffect, useState } from 'react'

function useMedia(query: string, initial = false) {
  const [v, setV] = useState(() => (typeof window === 'undefined' ? initial : window.matchMedia(query).matches))
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setV(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return v
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
export const useIsMobile = () => useMedia('(max-width: 768px)')

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}
