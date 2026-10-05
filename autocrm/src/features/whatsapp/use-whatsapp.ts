"use client";
import { useCallback } from "react";
import { toast } from "sonner";
import { useShell } from "@/components/layout/shell-state";
import { useCurrentUser } from "@/features/auth/user-provider";
import { useAddEvent } from "@/features/data/queries";
import type { BoardLead, LeadVehicle } from "@/features/data/types";
import { tenantUrl } from "@/features/tenants/host";
import { useTenant } from "@/features/tenants/tenant-provider";
import { vehicleShortTitle, vehicleTitle } from "@/features/vehicles/utils";
import type { MessageTemplateRow } from "@/types/database";
import { DEFAULT_GREETING, openWhatsApp, renderTemplate, vehicleSheet, waLink } from "./lib";

/** Link absoluto da página pública do veículo (funciona em subdomínio e em localhost). */
export function usePublicVehicleUrl() {
  const tenant = useTenant();
  const { rootDomain } = useShell();
  return useCallback(
    (vehicleId: string) => {
      const url = tenantUrl(tenant.slug, rootDomain, `/v/${vehicleId}`);
      return url.startsWith("http") ? url : `${window.location.origin}${url}`;
    },
    [tenant.slug, rootDomain],
  );
}

/**
 * Envia mensagem pelo WhatsApp do vendedor (wa.me) e registra "Contato via WhatsApp" na timeline,
 * o que também marca o primeiro atendimento do lead.
 */
export function useWhatsAppSender() {
  const tenant = useTenant();
  const me = useCurrentUser();
  const addEvent = useAddEvent();
  const publicUrl = usePublicVehicleUrl();

  const buildText = useCallback(
    (lead: BoardLead, body: string, vehicleOverride?: LeadVehicle | null) => {
      const v = vehicleOverride ?? lead.vehicle;
      return renderTemplate(body, {
        nome: lead.name,
        veiculo: v ? vehicleShortTitle(v) : lead.vehicle_interest,
        vendedor: (lead.assignee?.full_name ?? me.name).split(" ")[0],
        loja: tenant.name,
        ficha: v ? vehicleSheet(v, publicUrl(v.id)) : "",
        link: v ? publicUrl(v.id) : "",
      });
    },
    [me.name, tenant.name, publicUrl],
  );

  const send = useCallback(
    (lead: BoardLead, template?: Pick<MessageTemplateRow, "name" | "body"> | null, vehicleOverride?: LeadVehicle | null) => {
      const text = buildText(lead, template?.body ?? DEFAULT_GREETING, vehicleOverride);
      openWhatsApp(waLink(lead.phone, text));
      const v = vehicleOverride ?? lead.vehicle;
      addEvent.mutate(
        {
          leadId: lead.id,
          type: "whatsapp",
          data: { template: template?.name ?? "Saudação", text, vehicle: v ? vehicleTitle(v) : null },
        },
        { onSuccess: () => !lead.first_contact_at && toast.success("Primeiro contato registrado") },
      );
    },
    [buildText, addEvent],
  );

  return { send, buildText };
}
