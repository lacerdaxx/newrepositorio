"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BoardLead } from "@/features/data/types";
import { fadeUpItem, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { PipelineStageRow } from "@/types/database";
import { cardStatus, LeadCardView } from "./lead-card";

/** No celular o kanban vira abas por etapa + lista; mover é pelo menu do card. */
export function MobileBoard({
  stages,
  columns,
  leadById,
  now,
  alertMinutes,
  onOpen,
  onWhatsApp,
  onMove,
}: {
  stages: PipelineStageRow[];
  columns: Record<string, string[]>;
  leadById: Map<string, BoardLead>;
  now: number;
  alertMinutes: number;
  onOpen: (id: string) => void;
  onWhatsApp: (lead: BoardLead) => void;
  onMove: (leadId: string, stageId: string) => void;
}) {
  const [stageId, setStageId] = useState(stages[0]?.id);
  const stage = stages.find((s) => s.id === stageId) ?? stages[0];
  const leads = (columns[stage?.id ?? ""] ?? []).map((id) => leadById.get(id)!).filter(Boolean);

  return (
    <div className="flex flex-col gap-3 pb-6">
      <div className="flex gap-1.5 overflow-x-auto px-4 scrollbar-none" role="tablist" aria-label="Etapas">
        {stages.map((s) => {
          const active = s.id === stage?.id;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={active}
              onClick={() => setStageId(s.id)}
              className={cn(
                "relative flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
                active ? "border-border-strong text-foreground" : "border-border text-muted-foreground",
              )}
            >
              {active && <motion.span layoutId="mobile-stage" className="absolute inset-0 rounded-full bg-surface shadow-xs" />}
              <span className="relative size-1.5 rounded-full" style={{ background: s.color }} />
              <span className="relative">{s.name}</span>
              <span className="relative text-xs text-subtle-foreground tabular">{columns[s.id]?.length ?? 0}</span>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={stage?.id}
          variants={staggerContainer(0.03)}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0 }}
          className="flex flex-col gap-2 px-4"
        >
          {leads.length === 0 && <p className="py-10 text-center text-sm text-subtle-foreground">Nenhum lead nesta etapa.</p>}
          {leads.map((lead) => (
            <motion.div key={lead.id} variants={fadeUpItem}>
              <LeadCardView
                lead={lead}
                status={cardStatus(lead, stage!.kind, alertMinutes, now)}
                now={now}
                onOpen={onOpen}
                onWhatsApp={onWhatsApp}
                menu={
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex size-6 items-center justify-center rounded-md text-subtle-foreground hover:bg-accent"
                        aria-label="Mover para outra etapa"
                      >
                        <ArrowRightLeft className="size-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuLabel>Mover para</DropdownMenuLabel>
                      {stages
                        .filter((s) => s.id !== stage!.id)
                        .map((s) => (
                          <DropdownMenuItem key={s.id} onSelect={() => onMove(lead.id, s.id)}>
                            <span className="size-2 rounded-full" style={{ background: s.color }} /> {s.name}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                }
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
