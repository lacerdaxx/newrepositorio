export const LEAD_WEBHOOK_URL = (import.meta.env.VITE_LEAD_WEBHOOK_URL ?? '').trim()
export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(/\D/g, '')

export const whatsappLink = (text: string) =>
  WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}` : null

/**
 * Fotografias da campanha. Coloque os arquivos em /public/photos usando estes nomes
 * (extensões .webp e/ou .jpg). Veja public/photos/README.md.
 */
export const PHOTOS = {
  hero: { name: 'hero', w: 2400, h: 1350, alt: 'Veículo em estúdio no Mega Feirão de Aniversário da Multi Car Veículos' },
  zero: { name: 'showroom-zero-km', w: 1800, h: 1125, alt: 'Veículo zero km no showroom da Multi Car Veículos' },
  seminovo: { name: 'showroom-seminovo', w: 1200, h: 1600, alt: 'Veículo semi-novo na Multi Car Veículos' },
  detalhe: { name: 'showroom-detalhe', w: 1200, h: 1500, alt: 'Detalhe da carroceria de um veículo do estoque' },
  panorama: { name: 'showroom-panorama', w: 2400, h: 1000, alt: 'Pátio com a linha de veículos do estoque Multi Car' },
} as const
