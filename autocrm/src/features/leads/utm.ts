import type { LeadSource } from "@/types/database";

export type Utm = Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term", string>>;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function readUtm(search: string | URLSearchParams): Utm {
  const p = typeof search === "string" ? new URLSearchParams(search) : search;
  const out: Utm = {};
  for (const k of UTM_KEYS) {
    const v = p.get(k);
    if (v) out[k] = v.slice(0, 160);
  }
  return out;
}

/** Origem do lead a partir das UTMs dos anúncios (Meta usa utm_source=facebook/instagram/ig/fb). */
export function sourceFromUtm(utm: Utm, fallback: LeadSource = "site"): LeadSource {
  const s = (utm.utm_source ?? "").toLowerCase();
  if (/(^|_)(ig|instagram)/.test(s)) return "instagram";
  if (/(facebook|^fb|meta|an$|messenger)/.test(s)) return "meta_ads";
  if (/whats/.test(s)) return "whatsapp";
  if (/(olx|webmotors|icarros|mobiauto|portal)/.test(s)) return "portal";
  return fallback;
}
