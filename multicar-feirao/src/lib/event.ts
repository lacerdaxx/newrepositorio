import { site } from '../config/site'

export type EventPhase = 'before' | 'live' | 'ended'

export function getCountdown(now = Date.now()) {
  const start = new Date(site.eventStart).getTime()
  const end = new Date(site.eventEnd).getTime()
  if (now >= end) return { phase: 'ended' as EventPhase, d: 0, h: 0, m: 0, s: 0 }
  if (now >= start) return { phase: 'live' as EventPhase, d: 0, h: 0, m: 0, s: 0 }
  const diff = Math.floor((start - now) / 1000)
  return {
    phase: 'before' as EventPhase,
    d: Math.floor(diff / 86400),
    h: Math.floor((diff % 86400) / 3600),
    m: Math.floor((diff % 3600) / 60),
    s: diff % 60,
  }
}
