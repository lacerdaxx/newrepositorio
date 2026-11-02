import { LEAD_WEBHOOK_URL } from '../config'

export type Lead = {
  nome: string
  whatsapp: string
  veiculoInteresse: string
  possuiUsadoParaTroca: 'sim' | 'nao'
  consentimentoLGPD: boolean
}

export const maskPhone = (raw: string) => {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const DDDS = new Set(
  '11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99'.split(' '),
)

export const validatePhone = (masked: string) => {
  const d = masked.replace(/\D/g, '')
  if (d.length < 10) return 'Informe o WhatsApp com DDD.'
  if (!DDDS.has(d.slice(0, 2))) return 'DDD inválido.'
  if (d.length === 11 && d[2] !== '9') return 'Celular deve começar com 9 após o DDD.'
  if (d.length === 10 && !/[2-5]/.test(d[2])) return 'Número inválido.'
  return ''
}

export const validateName = (v: string) => {
  const t = v.trim().replace(/\s+/g, ' ')
  if (t.length < 5 || !t.includes(' ')) return 'Informe nome e sobrenome.'
  return ''
}

export type SendResult = { ok: true } | { ok: false; reason: 'not-configured' | 'network' | 'server' }

/** Envia o lead ao webhook configurado. Sem webhook, NÃO finge sucesso. */
export async function sendLead(lead: Lead): Promise<SendResult> {
  if (!LEAD_WEBHOOK_URL) return { ok: false, reason: 'not-configured' }
  const params = new URLSearchParams(window.location.search)
  const payload = {
    ...lead,
    whatsapp: lead.whatsapp.replace(/\D/g, ''),
    campanha: 'mega-feirao-aniversario-multi-car',
    origem: window.location.href,
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    enviadoEm: new Date().toISOString(),
  }
  try {
    const res = await fetch(LEAD_WEBHOOK_URL, {
      method: 'POST',
      // text/plain evita preflight CORS em webhooks (Zapier, Make, n8n, Apps Script) e continua sendo JSON no corpo.
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(payload),
    })
    return res.ok ? { ok: true } : { ok: false, reason: 'server' }
  } catch {
    return { ok: false, reason: 'network' }
  }
}
