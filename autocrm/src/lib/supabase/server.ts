import "server-only";
import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { env } from "@/lib/env";
import { authCookieDomain } from "./cookie-domain";

/** Cliente Supabase para Server Components, Server Actions e Route Handlers (sessão do usuário). */
export async function getSupabaseServer() {
  const cookieStore = await cookies();
  const host = (await headers()).get("host") ?? "";
  const domain = authCookieDomain(host);

  return createServerClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    cookieOptions: domain ? { domain } : undefined,
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          for (const { name, value, options } of toSet) cookieStore.set(name, value, options);
        } catch {
          // chamado de Server Component: o middleware já renova a sessão
        }
      },
    },
  });
}
