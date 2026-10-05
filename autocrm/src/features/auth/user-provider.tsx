"use client";
import * as React from "react";
import type { Role } from "@/config/nav";
import type { CurrentUser } from "./types";

const UserContext = React.createContext<CurrentUser | null>(null);

export function UserProvider({ user, children }: { user: CurrentUser; children: React.ReactNode }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useCurrentUser() {
  const ctx = React.useContext(UserContext);
  if (!ctx) throw new Error("useCurrentUser deve ser usado dentro de <UserProvider>");
  return ctx;
}

export function canSee(role: Role, allowed?: Role[]) {
  return !allowed || allowed.includes(role);
}
