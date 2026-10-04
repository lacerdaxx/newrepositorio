type Fbq = (...args: unknown[]) => void;

function fbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const f = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof f === "function") f(...args);
}

/** Leads A e B viram o evento padrão "Lead" (bom para otimizar campanha); C vira "LeadC". */
export function trackLead(classificacao: "A" | "B" | "C", pontuacao: number) {
  if (classificacao === "C") fbq("trackCustom", "LeadC", { score: pontuacao });
  else fbq("track", "Lead", { lead_class: classificacao, score: pontuacao });
}
