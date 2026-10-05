"use server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseServer } from "@/lib/supabase/server";
import { DEMO_MODE_ERROR, type ActionResult } from "@/lib/action";

const signInSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
  next: z.string().optional(),
});

function safeNext(next: string | undefined) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export async function signInAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) redirect("/meu-dia");
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) {
    return {
      ok: false,
      error: error.message.includes("Invalid login") ? "E-mail ou senha incorretos." : "Não foi possível entrar. Tente novamente.",
    };
  }
  redirect(safeNext(parsed.data.next));
}

export async function requestPasswordResetAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, error: DEMO_MODE_ERROR };
  const email = z.string().trim().email().safeParse(formData.get("email"));
  if (!email.success) return { ok: false, error: "E-mail inválido" };

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const origin = `${proto}://${h.get("host")}`;
  const supabase = await getSupabaseServer();
  await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${origin}/auth/callback?next=/auth/nova-senha`,
  });
  // resposta idêntica exista ou não o e-mail (evita enumeração de usuários)
  return { ok: true, message: "Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha." };
}

export async function updatePasswordAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, error: DEMO_MODE_ERROR };
  const parsed = z
    .object({ password: z.string().min(8, "Use pelo menos 8 caracteres"), confirm: z.string() })
    .refine((d) => d.password === d.confirm, { message: "As senhas não conferem", path: ["confirm"] })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, error: "Link expirado. Solicite uma nova recuperação de senha." };
  redirect("/");
}
