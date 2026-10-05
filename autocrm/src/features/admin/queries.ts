import "server-only";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseServer } from "@/lib/supabase/server";
import { demoTenant } from "@/features/tenants/demo-tenant";
import type { ProfileRow, TenantOverviewRow, TenantRow } from "@/types/database";

const now = new Date().toISOString();

const demoOverview: TenantOverviewRow[] = [
  { id: demoTenant.id, name: demoTenant.name, slug: demoTenant.slug, logo_url: null, primary_color: demoTenant.primaryColor, active: true, created_at: now, users_count: 6, leads_month: 412, leads_total: 2381, sales_month: 28, unattended: 3 },
  { id: "00000000-0000-0000-0000-000000000002", name: "Prime Veículos", slug: "prime-veiculos", logo_url: null, primary_color: "#0ea5e9", active: true, created_at: now, users_count: 4, leads_month: 238, leads_total: 1104, sales_month: 17, unattended: 0 },
  { id: "00000000-0000-0000-0000-000000000003", name: "Goiânia Motors", slug: "goiania-motors", logo_url: null, primary_color: "#16a34a", active: true, created_at: now, users_count: 5, leads_month: 301, leads_total: 1550, sales_month: 22, unattended: 7 },
  { id: "00000000-0000-0000-0000-000000000004", name: "Auto Center Sul", slug: "auto-center-sul", logo_url: null, primary_color: "#f59e0b", active: false, created_at: now, users_count: 2, leads_month: 0, leads_total: 312, sales_month: 0, unattended: 0 },
];

const demoProfiles: ProfileRow[] = [
  ["Ricardo Mendes", "gerente", 1],
  ["Ana Ribeiro", "vendedor", 2],
  ["Pedro Lima", "vendedor", 1],
  ["Lucas Martins", "vendedor", 1],
  ["Fernanda Rocha", "vendedor", 0],
].map(([name, role, weight], i) => ({
  id: `00000000-0000-0000-0000-0000000001${String(i).padStart(2, "0")}`,
  tenant_id: demoTenant.id,
  role: role as ProfileRow["role"],
  full_name: name as string,
  email: `${(name as string).split(" ")[0]!.toLowerCase()}@abcmultimarcas.com.br`,
  phone: null,
  avatar_url: null,
  active: i !== 4,
  receives_leads: role === "vendedor",
  distribution_weight: weight as number,
  last_assigned_at: null,
  created_at: now,
  updated_at: now,
}));

export async function getTenantOverview(): Promise<TenantOverviewRow[]> {
  if (!isSupabaseConfigured) return demoOverview;
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.rpc("admin_tenant_overview");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getTenantById(id: string): Promise<TenantRow | null> {
  if (!isSupabaseConfigured) {
    const o = demoOverview.find((t) => t.id === id);
    if (!o) return null;
    return {
      ...o,
      custom_domain: null,
      favicon_url: null,
      secondary_color: "#0a0a0a",
      whatsapp: demoTenant.whatsapp,
      timezone: "America/Sao_Paulo",
      offers_group_url: null,
      no_contact_alert_minutes: 15,
      distribution_mode: "round_robin",
      respect_business_hours: true,
      form_config: {},
      updated_at: now,
    };
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase.from("tenants").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getTenantUsers(tenantId: string): Promise<ProfileRow[]> {
  if (!isSupabaseConfigured) return demoProfiles;
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("active", { ascending: false })
    .order("role")
    .order("full_name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export type SwitchableTenant = { id: string; name: string; slug: string; primaryColor: string; active: boolean };

/** Lojas para o seletor da agência (sidebar). */
export async function getSwitchableTenants(): Promise<SwitchableTenant[]> {
  if (!isSupabaseConfigured) {
    return demoOverview.map((t) => ({ id: t.id, name: t.name, slug: t.slug, primaryColor: t.primary_color, active: t.active }));
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase.from("tenants").select("id, name, slug, primary_color, active").order("name");
  return (data ?? []).map((t) => ({ id: t.id, name: t.name, slug: t.slug, primaryColor: t.primary_color, active: t.active }));
}
