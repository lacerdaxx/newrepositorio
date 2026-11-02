export const WEBHOOK_URL = (import.meta.env.VITE_LEAD_WEBHOOK_URL as string | undefined)?.trim() || ''
export const WHATSAPP = ((import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || '').replace(/\D/g, '')

export const BRANDS = ['BYD', 'CITROËN', 'PEUGEOT', 'FORD', 'NISSAN'] as const

export const NAV = [
  { href: '#feirao', label: 'Feirão' },
  { href: '#ofertas', label: 'Ofertas' },
  { href: '#estoque', label: 'Estoque' },
  { href: '#cadastro', label: 'Cadastro' },
] as const

// Fotos: coloque os originais em photos-src/ e rode `npm run photos`.
// `name` é o nome-base gerado em public/photos/. Ajuste os `alt` conforme a foto real.
export const PHOTOS = {
  hero: { name: 'hero', alt: 'Veículo em destaque no Mega Feirão de Aniversário Multi Car', w: 2560, h: 1440 },
  byd: { name: 'byd', alt: 'Veículo BYD disponível no estoque da Multi Car', w: 2000, h: 1500 },
  citroen: { name: 'citroen', alt: 'Veículo Citroën disponível no estoque da Multi Car', w: 1500, h: 2000 },
  peugeot: { name: 'peugeot', alt: 'Veículo Peugeot disponível no estoque da Multi Car', w: 1800, h: 1800 },
  ford: { name: 'ford', alt: 'Veículo Ford disponível no estoque da Multi Car', w: 2400, h: 1350 },
  nissan: { name: 'nissan', alt: 'Veículo Nissan disponível no estoque da Multi Car', w: 2800, h: 1200 },
} as const
export type PhotoKey = keyof typeof PHOTOS
