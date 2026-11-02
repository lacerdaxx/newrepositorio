/** Máscara de telefone brasileiro: (61) 99999-9999 ou (61) 3333-4444 */
export function maskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** WhatsApp exige celular: DDD válido + 9 dígitos começando em 9. */
export function isValidMobile(value: string): boolean {
  const d = value.replace(/\D/g, '')
  return /^([1-9][1-9])9\d{8}$/.test(d)
}

export const toE164 = (value: string) => `+55${value.replace(/\D/g, '')}`
