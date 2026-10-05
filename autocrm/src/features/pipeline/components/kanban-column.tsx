"use client";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Inbox, Trophy, XCircle } from "lucide-react";
import type { BoardLead } from "@/features/data/types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PipelineStageRow } from "@/types/database";
import { leadValue } from "../filters";
import { cardStatus, SortableLeadCard } from "./lead-card";

export function KanbanColumn({
  stage,
  leads,
  now,
  alertMinutes,
  onOpen,
  onWhatsApp,
  isOver,
}: {
  stage: PipelineStageRow;
  leads: BoardLead[];
  now: number;
  alertMinutes: number;
  onOpen: (id: string) => void;
  onWhatsApp: (lead: BoardLead) => void;
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: `stage:${stage.id}`, data: { type: "stage", stageId: stage.id } });
  const total = leads.reduce((s, l) => s + leadValue(l), 0);
  const late = leads.filter((l) => cardStatus(l, stage.kind, alertMinutes, now) === "late").length;

  return (
    <section
      aria-label={`Etapa ${stage.name}`}
      className={cn(
        "flex h-full w-[284px] shrink-0 flex-col rounded-xl border border-transparent bg-surface-2/70 transition-[background-color,border-color] duration-150",
        isOver && "border-[color-mix(in_oklch,var(--brand)_35%,var(--border))] bg-[color-mix(in_oklch,var(--brand)_6%,var(--surface-2))]",
      )}
    >
      <header className="flex flex-col gap-1 px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: stage.color }} />
          <h2 className="truncate text-[13px] font-semibold">{stage.name}</h2>
          {stage.kind === "won" && <Trophy className="size-3.5 text-success" />}
          {stage.kind === "lost" && <XCircle className="size-3.5 text-danger" />}
          <span className="ml-auto rounded-md bg-muted px-1.5 text-[11px] font-medium text-muted-foreground tabular">{leads.length}</span>
        </div>
        <div className="flex items-center gap-2 text-[11.5px] text-subtle-foreground">
          <span className="tabular">{total > 0 ? formatCurrency(total, { compact: total >= 1_000_000 }) : "—"}</span>
          {late > 0 && <span className="font-medium text-danger">{late} sem contato</span>}
        </div>
      </header>
      <div ref={setNodeRef} className="flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2 scrollbar-none">
        <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <SortableLeadCard
              key={lead.id}
              lead={lead}
              stageId={stage.id}
              status={cardStatus(lead, stage.kind, alertMinutes, now)}
              now={now}
              onOpen={onOpen}
              onWhatsApp={onWhatsApp}
            />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <div
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-8 text-xs text-subtle-foreground transition-colors",
              isOver && "border-[color-mix(in_oklch,var(--brand)_50%,var(--border))] text-brand",
            )}
          >
            <Inbox className="size-4" />
            {isOver ? "Solte aqui" : "Nenhum lead"}
          </div>
        )}
      </div>
    </section>
  );
}
