import "server-only";
import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseServer } from "@/lib/supabase/server";
import { demoVehicles } from "@/features/data/demo-data";
import type { PublicVehicle, PublicVehicleSummary } from "@/types/database";

export const getPublicVehicle = cache(async (tenantSlug: string, id: string): Promise<PublicVehicle | null> => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  if (!isSupabaseConfigured) {
    const v = demoVehicles.find((x) => x.id === id);
    if (!v) return null;
    const { plate, tenant_id: _t, created_at: _c, updated_at: _u, ...rest } = v;
    return { ...rest, plate_end: plate?.slice(-1) ?? "", photos: [] };
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase.rpc("get_public_vehicle", { p_tenant_slug: tenantSlug, p_vehicle_id: id });
  return data ?? null;
});

export async function listPublicVehicles(tenantSlug: string): Promise<PublicVehicleSummary[]> {
  if (!isSupabaseConfigured) return demoVehicles.filter((v) => v.status !== "vendido");
  const supabase = await getSupabaseServer();
  const { data } = await supabase.rpc("list_public_vehicles", { p_tenant_slug: tenantSlug });
  return data ?? [];
}
