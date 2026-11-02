import { WEBHOOK_URL } from '../data/content'

export interface LeadPayload {
  name: string
  whatsapp: string
  vehicleInterest: string
  hasTradeIn: boolean
  consent: boolean
  consentText: string
}

export type SendResult = 'sent' | 'not-configured' | 'failed'

export const isLeadIntegrationConfigured = () => WEBHOOK_URL.length > 0

/**
 * Envia o lead como JSON para o webhook/CRM configurado em VITE_LEAD_WEBHOOK_URL.
 * Sem URL configurada NÃO simula sucesso: retorna 'not-configured'.
 */
export async function sendLead(lead: LeadPayload): Promise<SendResult> {
  if (!WEBHOOK_URL) return 'not-configured'
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid']) {
    const v = params.get(k)
    if (v) utm[k] = v
  }
  const body = {
    ...lead,
    source: 'landing-mega-feirao-aniversario',
    pageUrl: window.location.href.split('#')[0],
    referrer: document.referrer || undefined,
    submittedAt: new Date().toISOString(),
    ...utm,
  }
  const ctrl = new AbortController()
  const t = window.setTimeout(() => ctrl.abort(), 12000)
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    })
    return res.ok ? 'sent' : 'failed'
  } catch {
    return 'failed'
  } finally {
    window.clearTimeout(t)
  }
}
