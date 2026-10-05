export type TenantBranding = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  whatsapp: string | null;
  timezone: string;
  offersGroupUrl: string | null;
  active: boolean;
};

/** Contexto "agência": acesso pelo domínio raiz, sem loja selecionada. */
export const AGENCY_TENANT_ID = "agency";
