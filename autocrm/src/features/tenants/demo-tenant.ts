import type { TenantBranding } from "./types";
import { AGENCY_TENANT_ID } from "./types";

/** Loja usada no modo demonstração (sem Supabase configurado). */
export const demoTenant: TenantBranding = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "ABC Multimarcas",
  slug: "abc-multimarcas",
  logoUrl: null,
  faviconUrl: null,
  primaryColor: "#e30613",
  secondaryColor: "#0a0a0a",
  whatsapp: "5561999990000",
  timezone: "America/Sao_Paulo",
  offersGroupUrl: null,
  active: true,
  noContactAlertMinutes: 15,
};

export const agencyBranding: TenantBranding = {
  id: AGENCY_TENANT_ID,
  name: process.env.NEXT_PUBLIC_AGENCY_NAME || "AutoCRM",
  slug: "agencia",
  logoUrl: null,
  faviconUrl: null,
  primaryColor: process.env.NEXT_PUBLIC_AGENCY_COLOR || "#6366f1",
  secondaryColor: "#0a0a0a",
  whatsapp: null,
  timezone: "America/Sao_Paulo",
  offersGroupUrl: null,
  active: true,
  noContactAlertMinutes: 15,
};
