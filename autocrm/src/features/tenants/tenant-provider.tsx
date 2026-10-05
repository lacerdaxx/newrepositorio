"use client";
import * as React from "react";
import { tenantCssVars } from "./theme";
import type { TenantBranding } from "./types";

const TenantContext = React.createContext<TenantBranding | null>(null);

export function useTenant() {
  const ctx = React.useContext(TenantContext);
  if (!ctx) throw new Error("useTenant deve ser usado dentro de <TenantProvider>");
  return ctx;
}

export function TenantProvider({ tenant, children }: { tenant: TenantBranding; children: React.ReactNode }) {
  // Aplica no <html> para que portals (dialogs, menus, toasts) também herdem a cor
  React.useEffect(() => {
    const root = document.documentElement;
    const vars = tenantCssVars(tenant);
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
  }, [tenant]);

  return <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>;
}
