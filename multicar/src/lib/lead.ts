export type Lead = {
  nome: string
  whatsapp: string
  veiculo_interesse: string
  possui_usado_troca: 'sim' | 'nao'
  consentimento_lgpd: boolean
}

export const WEBHOOK_URL = (import.meta.env.VITE_LEAD_WEBHOOK_URL as string | undefined)?.trim() || ''
export const WHATSAPP = ((import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || '').replace(/\D/g, '')

export function maskPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function validPhone(v: string) {
  const d = v.replace(/\D/g, '')
  if (d.length !== 10 && d.length !== 11) return false
  const ddd = Number(d.slice(0, 2))
  if (ddd < 11 || ddd > 99) return false
  return d.length === 10 || d[2] === '9'
}

export function validName(v: string) {
  return v.trim().split(/\s+/).filter((p) => p.length > 1).length >= 2
}

export async function sendLead(lead: Lead) {
  if (!WEBHOOK_URL) throw new Error('NOT_CONFIGURED')
  const p = new URLSearchParams(window.location.search)
  const body = {
    ...lead,
    whatsapp: '55' + lead.whatsapp.replace(/\D/g, ''),
    campanha: 'mega-feirao-aniversario-multi-car',
    origem: window.location.href,
    utm_source: p.get('utm_source'),
    utm_medium: p.get('utm_medium'),
    utm_campaign: p.get('utm_campaign'),
    utm_content: p.get('utm_content'),
    enviado_em: new Date().toISOString(),
  }
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP_${res.status}`)
}
