/**
 * Formatação padrão Brasil: R$, dd/mm/aaaa, (61) 99999-9999.
 */
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const brlCents = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const brlCompact = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});
const num = new Intl.NumberFormat("pt-BR");
const pct = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });

export const formatCurrency = (v: number, opts?: { cents?: boolean; compact?: boolean }) =>
  opts?.compact ? brlCompact.format(v) : opts?.cents ? brlCents.format(v) : brl.format(v);

export const formatNumber = (v: number) => num.format(v);
export const formatPercent = (ratio: number) => pct.format(ratio);
export const formatKm = (km: number) => `${num.format(km)} km`;

export function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateTime(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return `${formatDate(date)} ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

/** "agora", "5 min", "2 h", "3 d" — usado nos cards do funil. */
export function formatElapsed(from: Date | string, now: Date = new Date()) {
  const date = typeof from === "string" ? new Date(from) : from;
  const diffMin = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 60000));
  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin} min`;
  const h = Math.floor(diffMin / 60);
  if (h < 24) return `${h} h`;
  return `${Math.floor(h / 24)} d`;
}

/** Normaliza telefone brasileiro para E.164 sem "+": 55DDDNÚMERO. Retorna null se inválido. */
export function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  if (!digits.startsWith("55")) return null;
  // 55 + DDD(2) + número(8 ou 9)
  if (digits.length === 12) {
    // fixo ou celular antigo sem o 9: adiciona o 9 se for celular (começa com 6-9)
    const first = digits[4];
    if (first && /[6-9]/.test(first)) digits = `${digits.slice(0, 4)}9${digits.slice(4)}`;
  }
  return digits.length === 12 || digits.length === 13 ? digits : null;
}

/** 5561999998888 → (61) 99999-8888 */
export function formatPhone(raw: string): string {
  const n = normalizePhone(raw);
  if (!n) return raw;
  const ddd = n.slice(2, 4);
  const rest = n.slice(4);
  return rest.length === 9
    ? `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`
    : `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
}

/** ABC1D23 → ABC•••3 (placa parcialmente oculta) */
export function maskPlate(plate: string) {
  const p = plate.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  if (p.length < 4) return p;
  return `${p.slice(0, 3)}•••${p.slice(-1)}`;
}
