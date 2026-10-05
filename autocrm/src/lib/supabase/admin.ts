import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { env, serviceRoleKey } from "@/lib/env";

/**
 * Cliente com service role — IGNORA RLS. Usar apenas em Server Actions após checar
 * explicitamente a permissão do usuário (ex.: criar usuários, criar lojas).
 */
export function getSupabaseAdmin() {
  return createClient<Database>(env.supabaseUrl, serviceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
