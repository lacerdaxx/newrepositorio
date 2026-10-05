import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseServer } from "@/lib/supabase/server";
import { demoUser } from "./demo-user";
import type { CurrentUser } from "./types";

/** Usuário logado + profile (memoizado por request). null se não autenticado. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  if (!isSupabaseConfigured) return demoUser;
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, tenant_id, avatar_url, active")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) return null;

  return {
    id: profile.id,
    name: profile.full_name || profile.email,
    email: profile.email,
    role: profile.role,
    tenantId: profile.tenant_id,
    avatarUrl: profile.avatar_url,
    active: profile.active,
  };
});

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export function isManager(user: CurrentUser, tenantId: string) {
  return user.role === "superadmin" || (user.role === "gerente" && user.tenantId === tenantId);
}

/** Página exclusiva da agência. */
export async function requireSuperadmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== "superadmin") redirect("/");
  return user;
}
