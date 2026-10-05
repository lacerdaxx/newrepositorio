"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { env } from "@/lib/env";
import { authCookieDomain } from "./cookie-domain";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function getSupabaseBrowser() {
  if (!client) {
    const domain = authCookieDomain(window.location.hostname);
    client = createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
      cookieOptions: domain ? { domain } : undefined,
    });
  }
  return client;
}
