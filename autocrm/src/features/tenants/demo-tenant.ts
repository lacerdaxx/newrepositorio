import type { TenantBranding } from "./types";

/** Tenant usado enquanto o Supabase não está configurado (Fase 1). */
export const demoTenant: TenantBranding = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "ABC Multimarcas",
  slug: "abc-multimarcas",
  logoUrl: null,
  primaryColor: "#e30613",
  secondaryColor: "#0a0a0a",
  whatsapp: "5561999990000",
  timezone: "America/Sao_Paulo",
};
