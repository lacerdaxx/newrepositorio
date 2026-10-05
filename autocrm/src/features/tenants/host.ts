/**
 * Resolve o contexto de loja a partir do host da requisição.
 *   loja.dominio.com.br       → { kind: "tenant", slug: "loja" }
 *   dominio.com.br / app.*    → { kind: "agency" }  (painel da agência)
 *   carros.lojax.com.br       → { kind: "domain", domain }  (domínio próprio)
 *   localhost / *.vercel.app  → slug via cookie (?loja=slug) ou NEXT_PUBLIC_DEV_TENANT_SLUG
 */
export type HostContext =
  | { kind: "tenant"; slug: string }
  | { kind: "domain"; domain: string }
  | { kind: "agency" }
  | { kind: "dev" };

export const RESERVED_SUBDOMAINS = new Set(["www", "app", "admin", "api", "agencia"]);
export const TENANT_COOKIE = "autocrm_loja";
export const AGENCY_SLUG = "agencia";

export function resolveHost(rawHost: string, rootDomain: string): HostContext {
  const host = rawHost.split(":")[0]?.toLowerCase().replace(/\.$/, "") ?? "";
  const root = rootDomain.toLowerCase();

  // {slug}.localhost funciona nos navegadores modernos sem configurar DNS
  if (host.endsWith(".localhost")) {
    const sub = host.slice(0, -".localhost".length);
    return RESERVED_SUBDOMAINS.has(sub) ? { kind: "agency" } : { kind: "tenant", slug: sub };
  }
  if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".vercel.app") || !host) {
    return { kind: "dev" };
  }
  if (host === root) return { kind: "agency" };
  if (host.endsWith(`.${root}`)) {
    const sub = host.slice(0, -(root.length + 1));
    if (sub.includes(".")) return { kind: "domain", domain: host };
    return RESERVED_SUBDOMAINS.has(sub) ? { kind: "agency" } : { kind: "tenant", slug: sub };
  }
  return { kind: "domain", domain: host };
}

export function isValidSlug(slug: string) {
  return /^[a-z0-9](?:[a-z0-9-]{0,46}[a-z0-9])?$/.test(slug);
}

/** URL da loja para links (painel da agência → loja). */
export function tenantUrl(slug: string, rootDomain: string, path = "/") {
  if (!rootDomain || rootDomain === "localhost") return `${path}${path.includes("?") ? "&" : "?"}loja=${slug}`;
  return `https://${slug}.${rootDomain}${path}`;
}
