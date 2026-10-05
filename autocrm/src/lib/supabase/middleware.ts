import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { env, isSupabaseConfigured } from "@/lib/env";
import { AGENCY_SLUG, TENANT_COOKIE, isValidSlug, resolveHost } from "@/features/tenants/host";
import { authCookieDomain } from "./cookie-domain";

const PUBLIC_PREFIXES = ["/login", "/recuperar-senha", "/auth", "/f/", "/v/", "/catalogo", "/api/public", "/loja-indisponivel"];

export const TENANT_HEADER = "x-autocrm-tenant";
export const DOMAIN_HEADER = "x-autocrm-domain";
export const PATH_HEADER = "x-autocrm-path";

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const ctx = resolveHost(host, env.rootDomain);

  // ---------- contexto da loja ----------
  let slug = "";
  let domain = "";
  let setDevCookie: string | null = null;
  if (ctx.kind === "tenant") slug = ctx.slug;
  else if (ctx.kind === "domain") domain = ctx.domain;
  else if (ctx.kind === "dev") {
    const q = url.searchParams.get("loja");
    if (q && (isValidSlug(q) || q === AGENCY_SLUG)) {
      slug = q;
      setDevCookie = q;
    } else {
      slug = request.cookies.get(TENANT_COOKIE)?.value ?? env.devTenantSlug;
    }
    if (slug === AGENCY_SLUG) slug = "";
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(TENANT_HEADER, slug);
  requestHeaders.set(DOMAIN_HEADER, domain);
  requestHeaders.set(PATH_HEADER, url.pathname);

  let response = NextResponse.next({ request: { headers: requestHeaders } });
  const finalize = (res: NextResponse) => {
    if (setDevCookie) res.cookies.set(TENANT_COOKIE, setDevCookie, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 30 });
    return res;
  };

  if (!isSupabaseConfigured) return finalize(response);

  // ---------- sessão (renova tokens a cada request) ----------
  const cookieDomain = authCookieDomain(host);
  const supabase = createServerClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    cookieOptions: cookieDomain ? { domain: cookieDomain } : undefined,
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        for (const { name, value } of toSet) request.cookies.set(name, value);
        response = NextResponse.next({ request: { headers: requestHeaders } });
        for (const { name, value, options } of toSet) response.cookies.set(name, value, options);
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublic = url.pathname === "/" ? false : PUBLIC_PREFIXES.some((p) => url.pathname.startsWith(p));
  if (!user && !isPublic) {
    const login = url.clone();
    login.pathname = "/login";
    login.search = "";
    if (url.pathname !== "/") login.searchParams.set("next", url.pathname + url.search);
    const redirect = NextResponse.redirect(login);
    for (const c of response.cookies.getAll()) redirect.cookies.set(c);
    return finalize(redirect);
  }

  return finalize(response);
}
