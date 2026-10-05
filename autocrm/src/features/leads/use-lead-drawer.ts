"use client";
import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** A ficha do lead abre via ?lead=<id> — link compartilhável e funciona em qualquer página. */
export function useLeadDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const leadId = params.get("lead");

  const setLead = useCallback(
    (id: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (id) next.set("lead", id);
      else next.delete("lead");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, params],
  );

  return { leadId, open: setLead, close: () => setLead(null) };
}
