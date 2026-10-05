"use client";
import { useEffect } from "react";
import { toast } from "sonner";

/** Recebe o evento global "autocrm:new-lead" (atalho N, sidebar, paleta). Cadastro rápido completo na Fase 4. */
export function NewLeadListener() {
  useEffect(() => {
    const onNew = () => toast("Cadastro rápido de lead", { description: "Disponível na Fase 4 (captura de leads)." });
    window.addEventListener("autocrm:new-lead", onNew);
    return () => window.removeEventListener("autocrm:new-lead", onNew);
  }, []);
  return null;
}
