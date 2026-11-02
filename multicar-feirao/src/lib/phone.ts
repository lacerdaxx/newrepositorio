/** Máscara de telefone brasileiro: (00) 00000-0000 / (00) 0000-0000 */
export function maskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const VALID_DDD = /^(1[1-9]|2[1-24-8]|3[1-578]|4[1-9]|5[1-5]|6[1-9]|7[1-579]|8[1-9]|9[1-9])$/

export function isValidBrPhone(value: string): boolean {
  const d = value.replace(/\D/g, '')
  if (d.length !== 10 && d.length !== 11) return false
  if (!VALID_DDD.test(d.slice(0, 2))) return false
  if (d.length === 11 && d[2] !== '9') return false
  return true
}
