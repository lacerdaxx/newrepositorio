import { useEffect, useState } from 'react'
import { getCountdown } from '../lib/event'

export function useCountdown() {
  const [state, setState] = useState(() => getCountdown())
  useEffect(() => {
    const id = setInterval(() => setState(getCountdown()), 1000)
    return () => clearInterval(id)
  }, [])
  return state
}
