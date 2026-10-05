import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseServer } from "@/lib/supabase/server";
import { DOMAIN_HEADER, TENANT_HEADER } from "@/lib/supabase/middleware";
import type { PublicTenant } from "@/types/database";
import { demoTenant } from "./demo-tenant";
import type { TenantBranding } from "./types";

export type TenantContext =
  | { kind: "tenant"; tenant: TenantBranding }
  | { kind: "agency" }
  | { kind: "not_found"; slug: string };

export function toBranding(t: PublicTenant): TenantBranding {
  return {
    id: t.id,
    name: t.name,
    slug: t.slug,
    logoUrl: t.logo_url,
    faviconUrl: t.favicon_url,
    primaryColor: t.primary_color,
    secondaryColor: t.secondary_color,
    whatsapp: t.whatsapp,
    timezone: t.timezone,
    offersGroupUrl: t.offers_group_url,
    active: t.active,
    noContactAlertMinutes: t.no_contact_alert_minutes,
  };
}

/** Loja da requisição atual (definida pelo middleware a partir do subdomínio). Memoizada por request. */
export const getTenantContext = cache(async (): Promise<TenantContext> => {
  if (!isSupabaseConfigured) return { kind: "tenant", tenant: demoTenant };

  const h = await headers();
  const slug = h.get(TENANT_HEADER) ?? "";
  const domain = h.get(DOMAIN_HEADER) ?? "";
  if (!slug && !domain) return { kind: "agency" };

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.rpc(
    "get_public_tenant",
    slug ? { p_slug: slug } : { p_domain: domain },
  );
  const row = data?.[0];
  if (error || !row) return { kind: "not_found", slug: slug || domain };
  return { kind: "tenant", tenant: toBranding(row) };
});

/** Para rotas públicas (formulário, catálogo): exige uma loja ativa. */
export async function getPublicTenantOrNull(): Promise<TenantBranding | null> {
  const ctx = await getTenantContext();
  return ctx.kind === "tenant" && ctx.tenant.active ? ctx.tenant : null;
}
