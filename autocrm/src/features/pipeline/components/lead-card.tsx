"use client";
import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/icons";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import type { BoardLead } from "@/features/data/types";
import { SOURCE_META, SourceIcon } from "@/features/leads/labels";
import { VehicleImage } from "@/features/vehicles/vehicle-image";
import { vehicleShortTitle } from "@/features/vehicles/utils";
import { formatCurrency, formatElapsed } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { StageKind } from "@/types/database";
import { leadValue } from "../filters";

export type CardStatus = "new" | "late" | "ok";

export function cardStatus(lead: BoardLead, kind: StageKind, alertMinutes: number, now: number): CardStatus {
  if (kind !== "open" || lead.first_contact_at) return "ok";
  const mins = (now - new Date(lead.created_at).getTime()) / 60000;
  return mins >= alertMinutes ? "late" : "new";
}

type CardProps = {
  lead: BoardLead;
  status: CardStatus;
  now: number;
  onOpen: (id: string) => void;
  onWhatsApp: (lead: BoardLead) => void;
  menu?: React.ReactNode;
};

/** Visual do card (usado no board, no overlay de arraste e na lista mobile). */
export const LeadCardView = React.memo(function LeadCardView({
  lead,
  status,
  now,
  onOpen,
  onWhatsApp,
  menu,
  dragging,
  className,
}: CardProps & { dragging?: boolean; className?: string }) {
  const value = leadValue(lead);
  return (
    <div
      role="button"
      tabIndex={-1}
      onClick={() => onOpen(lead.id)}
      className={cn(
        "surface group/card relative cursor-pointer select-none rounded-xl border border-border bg-surface p-2.5 shadow-xs transition-[border-color,box-shadow,transform] duration-150",
        "hover:border-border-strong hover:shadow-md",
        status === "late" && "border-[color-mix(in_oklch,var(--danger)_45%,var(--border))]",
        dragging && "rotate-[1.5deg] scale-[1.03] cursor-grabbing border-border-strong shadow-lg",
        className,
      )}
    >
      <div className="flex gap-2.5">
        <VehicleImage
          src={lead.vehicle?.cover_url}
          brand={undefined}
          model={lead.vehicle?.model}
          className="h-10 w-14 shrink-0"
          rounded="rounded-md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-1.5">
            <span className="truncate text-[13px] font-medium leading-tight">{lead.name}</span>
            {status !== "ok" && (
              <span className="relative mt-1 flex size-1.5 shrink-0" aria-label={status === "late" ? "Sem contato" : "Novo"}>
                <span
                  className={cn(
                    "absolute inline-flex size-full animate-pulse-ring rounded-full",
                    status === "late" ? "bg-danger" : "bg-brand",
                  )}
                />
                <span className={cn("relative inline-flex size-1.5 rounded-full", status === "late" ? "bg-danger" : "bg-brand")} />
              </span>
            )}
          </div>
          <div className="mt-0.5 truncate text-xs text-muted-foreground">
            {lead.vehicle ? vehicleShortTitle(lead.vehicle) : (lead.vehicle_interest ?? "Sem veículo definido")}
          </div>
        </div>
        <Tooltip content="Chamar no WhatsApp">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onWhatsApp(lead);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={`WhatsApp de ${lead.name}`}
            className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_oklch,var(--whatsapp)_14%,transparent)] text-whatsapp transition-[transform,background-color] hover:scale-105 hover:bg-whatsapp hover:text-[#04210f] active:scale-95"
          >
            <WhatsAppIcon className="size-3.5" />
          </button>
        </Tooltip>
      </div>

      {lead.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {lead.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-md bg-muted px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center gap-2 text-[11.5px] text-muted-foreground">
        <Tooltip content={SOURCE_META[lead.source].label + (lead.campaign ? ` · ${lead.campaign}` : "")}>
          <span className="flex items-center">
            <SourceIcon source={lead.source} className="size-3.5" />
          </span>
        </Tooltip>
        <span
          className={cn(
            "flex items-center gap-1 tabular",
            status === "late" && "font-medium text-danger",
            status === "new" && "font-medium text-brand",
          )}
          title={status === "late" ? "Sem contato além do limite da loja" : status === "new" ? "Lead novo, aguardando contato" : undefined}
        >
          <Clock className="size-3" />
          {formatElapsed(lead.created_at, new Date(now))}
        </span>
        {value > 0 && <span className="ml-auto font-medium text-foreground tabular">{formatCurrency(value, { compact: value >= 1_000_000 })}</span>}
        <span className={cn(!value && "ml-auto")}>
          {lead.assignee ? (
            <Tooltip content={lead.assignee.full_name}>
              <span>
                <Avatar name={lead.assignee.full_name} src={lead.assignee.avatar_url} className="size-5 text-[8px]" />
              </span>
            </Tooltip>
          ) : (
            <Tooltip content="Sem vendedor">
              <span className="flex size-5 items-center justify-center rounded-full border border-dashed border-border-strong text-[9px] text-subtle-foreground">
                ?
              </span>
            </Tooltip>
          )}
        </span>
        {menu}
      </div>
    </div>
  );
});

/** Card arrastável (dnd-kit). Enquanto arrasta, o lugar original vira um placeholder tracejado. */
export function SortableLeadCard(props: CardProps & { stageId: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.lead.id,
    data: { type: "lead", stageId: props.stageId },
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      {...attributes}
      {...listeners}
      aria-roledescription="card arrastável"
      aria-label={`${props.lead.name}. Enter para abrir, espaço para mover`}
      onKeyDown={(e) => {
        listeners?.onKeyDown?.(e);
        if (e.key === "Enter") props.onOpen(props.lead.id);
      }}
      className="rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
    >
      {isDragging ? (
        <div className="rounded-xl border-2 border-dashed border-[color-mix(in_oklch,var(--brand)_40%,var(--border))] bg-[color-mix(in_oklch,var(--brand)_5%,transparent)]">
          <div className="invisible">
            <LeadCardView {...props} />
          </div>
        </div>
      ) : (
        <LeadCardView {...props} />
      )}
    </div>
  );
}
