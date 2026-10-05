import { isValidHex, readableForeground } from "@/lib/color";
import type { TenantBranding } from "./types";

type BrandColors = Pick<TenantBranding, "primaryColor" | "secondaryColor">;

/** Marca do tenant → CSS variables do design system. */
export function tenantCssVars(t: BrandColors): Record<string, string> {
  const primary = isValidHex(t.primaryColor) ? t.primaryColor : "#2563eb";
  return {
    "--brand": primary,
    "--brand-foreground": readableForeground(primary),
    "--brand-secondary": isValidHex(t.secondaryColor) ? t.secondaryColor : "#0a0a0a",
  };
}

/** CSS servido no HTML inicial (evita "flash" da cor padrão antes da hidratação). */
export function tenantStyleTag(t: BrandColors): string {
  const body = Object.entries(tenantCssVars(t))
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  return `:root{${body}}`;
}
