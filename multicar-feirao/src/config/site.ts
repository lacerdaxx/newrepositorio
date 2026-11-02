/**
 * Configuração central da campanha. Altere aqui textos, datas e contatos.
 * Valores sem dado real ficam vazios (placeholders) – nada é inventado.
 */
const env = import.meta.env

export const site = {
  brand: 'MULTI CAR VEÍCULOS',
  city: 'Luziânia-GO',
  campaignId: 'mega-feirao-aniversario-2026',
  /** Início do evento: 13/11/2026 00:00 (Brasília, UTC-3) */
  eventStart: '2026-11-13T00:00:00-03:00',
  /** Fim do evento: 15/11/2026 23:59:59 (Brasília) */
  eventEnd: '2026-11-15T23:59:59-03:00',
  contacts: {
    whatsappNumber: (env.VITE_WHATSAPP_NUMBER as string) || '', // ex.: 5561999999999
    instagramUrl: (env.VITE_INSTAGRAM_URL as string) || '',
    privacyUrl: (env.VITE_PRIVACY_URL as string) || '',
    address: '', // PREENCHER: endereço da loja
    phone: '', // PREENCHER: telefone da loja
  },
  /** Endpoint (webhook/CRM) que recebe o lead. Vazio = envio desativado. */
  leadWebhookUrl: (env.VITE_LEAD_WEBHOOK_URL as string) || '',
  legalText:
    'Condições sujeitas a análise e aprovação de crédito. Ofertas válidas de 13 a 15 de novembro de 2026 ou enquanto durarem os estoques. Imagens meramente ilustrativas. [PREENCHER: informações legais completas da campanha]',
} as const

export const offers = [
  { id: 'parcelas', kicker: '12 PRIMEIRAS PARCELAS', pre: 'POR APENAS', value: 'R$ 299,99', note: 'PELO BANCO VOLKSWAGEN' },
  { id: 'bonus', kicker: 'BÔNUS DE', pre: '', value: 'R$ 5.000', note: 'NO SEU USADO NA TROCA' },
  { id: 'carnaval', kicker: 'PRIMEIRA PARCELA', pre: '', value: 'SÓ DEPOIS', note: 'DO CARNAVAL' },
] as const

export const brands = ['BYD', 'CITROËN', 'PEUGEOT', 'FORD', 'NISSAN'] as const

/**
 * Estoque: preparado para dados reais. Preencha `image`, `name` etc. quando
 * disponíveis (ou carregue de uma API). Sem dados, os cards exibem placeholder.
 */
export interface StockItem {
  id: string
  brand: (typeof brands)[number]
  name?: string
  image?: string
}
export const stock: StockItem[] = brands.map((b) => ({ id: b.toLowerCase(), brand: b }))
