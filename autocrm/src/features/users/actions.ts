"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { DEMO_MODE_ERROR, friendlyDbError, zodFieldErrors, type ActionResult } from "@/lib/action";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getCurrentUser, isManager } from "@/features/auth/server";
import { newUserSchema, updateUserSchema, type NewUserInput, type UpdateUserInput } from "./schemas";

function revalidateUsers(tenantId: string) {
  revalidatePath("/configuracoes/usuarios");
  revalidatePath(`/admin/lojas/${tenantId}`);
}

export async function createUserAction(input: NewUserInput): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, error: DEMO_MODE_ERROR };
  const parsed = newUserSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Revise os campos destacados.", fieldErrors: zodFieldErrors(parsed.error.issues) };
  const d = parsed.data;

  const user = await getCurrentUser();
  if (!user || !isManager(user, d.tenantId)) return { ok: false, error: "Sem permissão para criar usuários nesta loja." };

  const { error } = await getSupabaseAdmin().auth.admin.createUser({
    email: d.email,
    password: d.password,
    email_confirm: true,
    app_metadata: { role: d.role, tenant_id: d.tenantId },
    user_metadata: { full_name: d.fullName },
  });
  if (error) {
    const taken = /already|registered|exists/i.test(error.message);
    return {
      ok: false,
      error: taken ? "Já existe um usuário com este e-mail." : "Não foi possível criar o usuário.",
      fieldErrors: taken ? { email: "E-mail já cadastrado" } : undefined,
    };
  }
  revalidateUsers(d.tenantId);
  return { ok: true, message: `${d.fullName} já pode acessar com o e-mail ${d.email}.` };
}

export async function updateUserAction(input: UpdateUserInput): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, error: DEMO_MODE_ERROR };
  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Dados inválidos." };
  const d = parsed.data;

  const user = await getCurrentUser();
  if (!user || !isManager(user, d.tenantId)) return { ok: false, error: "Sem permissão." };
  if (d.userId === user.id && (d.active === false || d.role === "vendedor")) {
    return { ok: false, error: "Você não pode desativar ou rebaixar o próprio usuário." };
  }

  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("profiles")
    .update({
      ...(d.fullName !== undefined && { full_name: d.fullName }),
      ...(d.role !== undefined && { role: d.role }),
      ...(d.active !== undefined && { active: d.active }),
      ...(d.receivesLeads !== undefined && { receives_leads: d.receivesLeads }),
      ...(d.distributionWeight !== undefined && { distribution_weight: d.distributionWeight }),
    })
    .eq("id", d.userId)
    .eq("tenant_id", d.tenantId);
  if (error) return { ok: false, error: friendlyDbError(error) };

  // usuário desativado perde a sessão imediatamente
  if (d.active === false) await getSupabaseAdmin().auth.admin.signOut(d.userId).catch(() => undefined);

  revalidateUsers(d.tenantId);
  return { ok: true };
}

export async function resetUserPasswordAction(input: {
  userId: string;
  tenantId: string;
  password: string;
}): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, error: DEMO_MODE_ERROR };
  const parsed = z
    .object({ userId: z.string().uuid(), tenantId: z.string().uuid(), password: z.string().min(8, "Mínimo de 8 caracteres") })
    .safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  const user = await getCurrentUser();
  if (!user || !isManager(user, parsed.data.tenantId)) return { ok: false, error: "Sem permissão." };

  // garante que o usuário-alvo é da loja (o service role ignora RLS)
  const admin = getSupabaseAdmin();
  const { data: target } = await admin.from("profiles").select("tenant_id, role").eq("id", parsed.data.userId).single();
  if (!target || target.tenant_id !== parsed.data.tenantId || target.role === "superadmin") {
    return { ok: false, error: "Usuário não encontrado nesta loja." };
  }
  const { error } = await admin.auth.admin.updateUserById(parsed.data.userId, { password: parsed.data.password });
  if (error) return { ok: false, error: friendlyDbError(error) };
  return { ok: true, message: "Senha redefinida." };
}

export async function updateOwnProfileAction(input: { fullName: string; password?: string }): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, error: DEMO_MODE_ERROR };
  const parsed = z
    .object({
      fullName: z.string().trim().min(2, "Informe seu nome"),
      password: z.union([z.literal(""), z.string().min(8, "A senha deve ter pelo menos 8 caracteres")]).optional(),
    })
    .safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão expirada." };
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("profiles").update({ full_name: parsed.data.fullName }).eq("id", user.id);
  if (error) return { ok: false, error: friendlyDbError(error) };
  if (parsed.data.password) {
    const { error: pwError } = await supabase.auth.updateUser({ password: parsed.data.password });
    if (pwError) return { ok: false, error: "Nome salvo, mas não foi possível trocar a senha." };
  }
  revalidatePath("/", "layout");
  return { ok: true, message: parsed.data.password ? "Perfil e senha atualizados." : "Perfil atualizado." };
}
