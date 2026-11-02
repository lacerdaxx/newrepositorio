import { site } from '../config/site'

export interface LeadPayload {
  nome: string
  whatsapp: string
  veiculoInteresse: string
  possuiUsado: 'sim' | 'nao'
  consentimento: boolean
  campanha: string
  origem: string
  enviadoEm: string
}

export class IntegrationNotConfigured extends Error {}

/**
 * Envia o lead ao webhook/CRM configurado (VITE_LEAD_WEBHOOK_URL).
 * Sem URL configurada NÃO simula envio: lança IntegrationNotConfigured.
 * Para adaptar a um CRM específico, transforme o payload aqui.
 */
export async function submitLead(payload: LeadPayload): Promise<void> {
  if (!site.leadWebhookUrl) throw new IntegrationNotConfigured()
  const res = await fetch(site.leadWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Webhook respondeu ${res.status}`)
}
