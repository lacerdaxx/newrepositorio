"use client";
import * as React from "react";
import { isSupabaseConfigured } from "@/lib/env";
import type { Repo } from "./types";

const RepoContext = React.createContext<Repo | null>(null);

export function RepoProvider({ children }: { children: React.ReactNode }) {
  const [repo, setRepo] = React.useState<Repo | null>(null);

  React.useEffect(() => {
    let alive = true;
    // carregamento sob demanda: o modo demonstração não leva o supabase-js, e vice-versa
    const load = isSupabaseConfigured
      ? import("./supabase-repo").then((m) => m.createSupabaseRepo())
      : import("./demo-repo").then((m) => m.demoRepo);
    void load.then((r) => alive && setRepo(r));
    return () => {
      alive = false;
    };
  }, []);

  return <RepoContext.Provider value={repo}>{children}</RepoContext.Provider>;
}

/** Repositório de dados (null enquanto carrega — as queries ficam desabilitadas até lá). */
export function useRepo() {
  return React.useContext(RepoContext);
}
