import { env } from "@/lib/env";

/**
 * Cookies de sessão compartilhados entre subdomínios (loja-a.dominio, loja-b.dominio),
 * para a agência navegar entre lojas sem novo login. Em localhost/preview: cookie do host.
 */
export function authCookieDomain(hostname: string): string | undefined {
  const host = hostname.split(":")[0]?.toLowerCase() ?? "";
  const root = env.rootDomain;
  if (!root || root === "localhost") return undefined;
  if (host === root || host.endsWith(`.${root}`)) return `.${root}`;
  return undefined;
}
