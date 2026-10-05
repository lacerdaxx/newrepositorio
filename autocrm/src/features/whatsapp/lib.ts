import { formatCurrency, formatKm } from "@/lib/format";
import type { MessageTemplateRow } from "@/types/database";
import { FUEL_LABEL, TRANSMISSION_LABEL, vehicleTitle, vehicleYears } from "@/features/vehicles/utils";
import type { LeadVehicle } from "@/features/data/types";

export type TemplateVars = {
  nome?: string | null;
  veiculo?: string | null;
  vendedor?: string | null;
  loja?: string | null;
  ficha?: string | null;
  link?: string | null;
};

/** Substitui {nome}, {veiculo}, {vendedor}, {loja}, {ficha}, {link}. Variável vazia vira texto neutro. */
export function renderTemplate(body: string, vars: TemplateVars) {
  const fallback: Record<string, string> = { nome: "", veiculo: "carro", vendedor: "", loja: "nossa loja", ficha: "", link: "" };
  return body
    .replace(/\{(nome|veiculo|vendedor|loja|ficha|link)\}/gi, (_, k: string) => {
      const key = k.toLowerCase() as keyof TemplateVars;
      const v = vars[key];
      if (key === "nome" && v) return v.split(" ")[0] ?? v;
      return v?.trim() ? v : (fallback[key] ?? "");
    })
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ ([,.!?])/g, "$1")
    .trim();
}

/** Link wa.me com mensagem pré-preenchida (abre WhatsApp Web/App do vendedor). */
export function waLink(phone: string | null | undefined, text?: string) {
  const digits = (phone ?? "").replace(/\D/g, "");
  const base = digits ? `https://wa.me/${digits}` : "https://wa.me/";
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Link de compartilhamento (escolher conversa/grupo no WhatsApp). */
export function waShareLink(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function openWhatsApp(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

type SheetVehicle = LeadVehicle &
  Partial<{ year_manufacture: number | null; transmission: keyof typeof TRANSMISSION_LABEL | null; fuel: keyof typeof FUEL_LABEL | null; color: string | null }>;

/** Ficha do veículo formatada para WhatsApp (*negrito* do próprio WhatsApp). */
export function vehicleSheet(v: SheetVehicle, publicUrl?: string) {
  const lines = [
    `🚗 *${vehicleTitle(v, { year: false })}*`,
    v.year_model ? `📅 Ano: ${vehicleYears({ year_manufacture: v.year_manufacture ?? null, year_model: v.year_model })}` : null,
    typeof v.km === "number" ? `🛣️ ${formatKm(v.km)}` : null,
    v.transmission ? `⚙️ Câmbio: ${TRANSMISSION_LABEL[v.transmission]}` : null,
    v.fuel ? `⛽ ${FUEL_LABEL[v.fuel]}` : null,
    v.color ? `🎨 Cor: ${v.color}` : null,
    v.price ? `💰 *${formatCurrency(Number(v.price))}*` : null,
    publicUrl ? `\n📸 Fotos e detalhes: ${publicUrl}` : null,
  ];
  return lines.filter(Boolean).join("\n");
}

export const DEFAULT_GREETING =
  "Olá, {nome}! Aqui é {vendedor}, da {loja}. Vi seu interesse no {veiculo} e estou à disposição para te ajudar.";

export function greetingTemplate(templates: MessageTemplateRow[]) {
  return templates.find((t) => t.category === "saudacao" && t.active)?.body ?? DEFAULT_GREETING;
}
