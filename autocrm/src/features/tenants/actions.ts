"use server";
import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/env";
import { DEMO_MODE_ERROR, friendlyDbError, zodFieldErrors, type ActionResult } from "@/lib/action";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getCurrentUser, isManager } from "@/features/auth/server";
import {
  brandingSchema,
  newTenantSchema,
  tenantAdminSchema,
  type BrandingInput,
  type NewTenantInput,
  type TenantAdminInput,
} from "./schemas";

export async function createTenantAction(input: NewTenantInput): Promise<ActionResult<{ id: string }>> {
  if (!isSupabaseConfigured) return { ok: false, error: DEMO_MODE_ERROR };
  const user = await getCurrentUser();
  if (user?.role !== "superadmin") return { ok: false, error: "Apenas a agência pode criar lojas." };

  const parsed = newTenantSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Revise os campos destacados.", fieldErrors: zodFieldErrors(parsed.error.issues) };
  const d = parsed.data;

  const admin = getSupabaseAdmin();
  const { data: tenant, error } = await admin
    .from("tenants")
    .insert({
      name: d.name,
      slug: d.slug,
      primary_color: d.primaryColor,
      secondary_color: d.secondaryColor,
      logo_url: d.logoUrl ?? null,
      whatsapp: d.whatsapp,
      timezone: d.timezone,
      offers_group_url: d.offersGroupUrl,
    })
    .select("id")
    .single();
  if (error || !tenant) {
    return error?.code === "23505"
      ? { ok: false, error: "Este endereço já está em uso.", fieldErrors: { slug: "Endereço já em uso" } }
      : { ok: false, error: friendlyDbError(error ?? { message: "" }) };
  }

  const { error: userError } = await admin.auth.admin.createUser({
    email: d.managerEmail,
    password: d.managerPassword,
    email_confirm: true,
    app_metadata: { role: "gerente", tenant_id: tenant.id },
    user_metadata: { full_name: d.managerName },
  });
  if (userError) {
    await admin.from("tenants").delete().eq("id", tenant.id); // desfaz a loja criada
    const taken = /already|registered|exists/i.test(userError.message);
    return {
      ok: false,
      error: taken ? "Já existe um usuário com este e-mail." : "Não foi possível criar o gerente.",
      fieldErrors: taken ? { managerEmail: "E-mail já cadastrado" } : undefined,
    };
  }

  revalidatePath("/admin");
  return { ok: true, data: { id: tenant.id } };
}

/** Marca da loja — gerente da loja ou agência (RLS + trigger garantem). */
export async function updateBrandingAction(tenantId: string, input: BrandingInput): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, error: DEMO_MODE_ERROR };
  const user = await getCurrentUser();
  if (!user || !isManager(user, tenantId)) return { ok: false, error: "Sem permissão." };

  const parsed = brandingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Revise os campos destacados.", fieldErrors: zodFieldErrors(parsed.error.issues) };
  const d = parsed.data;

  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("tenants")
    .update({
      name: d.name,
      primary_color: d.primaryColor,
      secondary_color: d.secondaryColor,
      logo_url: d.logoUrl ?? null,
      whatsapp: d.whatsapp,
      timezone: d.timezone,
      offers_group_url: d.offersGroupUrl,
    })
    .eq("id", tenantId);
  if (error) return { ok: false, error: friendlyDbError(error) };

  revalidatePath("/", "layout");
  return { ok: true, message: "Marca atualizada." };
}

/** Endereço, domínio próprio e ativação — somente agência. */
export async function updateTenantAdminAction(tenantId: string, input: TenantAdminInput): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, error: DEMO_MODE_ERROR };
  const user = await getCurrentUser();
  if (user?.role !== "superadmin") return { ok: false, error: "Apenas a agência pode alterar estes dados." };

  const parsed = tenantAdminSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Revise os campos destacados.", fieldErrors: zodFieldErrors(parsed.error.issues) };

  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("tenants")
    .update({ slug: parsed.data.slug, custom_domain: parsed.data.customDomain, active: parsed.data.active })
    .eq("id", tenantId);
  if (error) return { ok: false, error: error.code === "23505" ? "Endereço ou domínio já em uso." : friendlyDbError(error) };

  revalidatePath("/admin");
  revalidatePath(`/admin/lojas/${tenantId}`);
  return { ok: true, message: parsed.data.active ? "Loja atualizada." : "Loja desativada." };
}
