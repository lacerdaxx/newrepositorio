/**
 * Variáveis de ambiente. Sem Supabase configurado, o app roda em "modo demonstração"
 * (dados fictícios, sem login) — útil para pré-visualizações.
 */
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  rootDomain: (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost").toLowerCase(),
  devTenantSlug: process.env.NEXT_PUBLIC_DEV_TENANT_SLUG ?? "",
};

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);

export function serviceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada");
  return key;
}
