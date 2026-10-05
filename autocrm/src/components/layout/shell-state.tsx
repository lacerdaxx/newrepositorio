"use client";
import * as React from "react";
import type { SwitchableTenant } from "@/features/admin/queries";

type ShellState = {
  rootDomain: string;
  /** lojas acessíveis pela agência (vazio para usuários de loja) */
  tenants: SwitchableTenant[];
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean | ((p: boolean) => boolean)) => void;
};

const ShellContext = React.createContext<ShellState | null>(null);
export const SIDEBAR_COOKIE = "autocrm_sidebar_collapsed";

export function ShellProvider({
  defaultCollapsed,
  rootDomain,
  tenants,
  children,
}: {
  defaultCollapsed: boolean;
  rootDomain: string;
  tenants: SwitchableTenant[];
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsedState] = React.useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [paletteOpen, setPaletteOpen] = React.useState(false);

  const setCollapsed = React.useCallback((v: boolean) => {
    setCollapsedState(v);
    document.cookie = `${SIDEBAR_COOKIE}=${v ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  const value = React.useMemo<ShellState>(
    () => ({
      rootDomain,
      tenants,
      collapsed,
      setCollapsed,
      toggleCollapsed: () => setCollapsed(!collapsed),
      mobileOpen,
      setMobileOpen,
      paletteOpen,
      setPaletteOpen,
    }),
    [rootDomain, tenants, collapsed, setCollapsed, mobileOpen, paletteOpen],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell() {
  const ctx = React.useContext(ShellContext);
  if (!ctx) throw new Error("useShell deve ser usado dentro de <ShellProvider>");
  return ctx;
}
