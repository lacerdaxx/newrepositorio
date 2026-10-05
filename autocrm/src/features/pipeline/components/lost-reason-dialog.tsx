"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LOST_REASON_LABEL } from "@/features/leads/labels";
import { cn } from "@/lib/utils";
import type { LostReason } from "@/types/database";

const REASONS = Object.keys(LOST_REASON_LABEL) as LostReason[];

/** Motivo de perda obrigatório ao mover para "Perdido". */
export function LostReasonDialog({
  open,
  leadName,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  leadName?: string;
  onCancel: () => void;
  onConfirm: (reason: LostReason, note: string) => void;
}) {
  const [reason, setReason] = useState<LostReason | null>(null);
  const [note, setNote] = useState("");

  const close = () => {
    setReason(null);
    setNote("");
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Por que o lead foi perdido?</DialogTitle>
          <DialogDescription>{leadName ? `${leadName} · ` : ""}O motivo alimenta o relatório de perdas.</DialogDescription>
        </DialogHeader>
        <div role="radiogroup" aria-label="Motivo da perda" className="grid gap-1.5 sm:grid-cols-2">
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={reason === r}
              onClick={() => setReason(r)}
              className={cn(
                "relative flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-[13px] transition-colors",
                reason === r ? "border-danger/60 bg-danger/10 text-foreground" : "border-border hover:bg-accent",
              )}
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border",
                  reason === r ? "border-danger bg-danger text-white" : "border-border-strong",
                )}
              >
                {reason === r && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check className="size-3" strokeWidth={3} />
                  </motion.span>
                )}
              </span>
              {LOST_REASON_LABEL[r]}
            </button>
          ))}
        </div>
        <Textarea placeholder="Observação (opcional)" value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
        <DialogFooter>
          <Button variant="ghost" onClick={close}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={!reason}
            onClick={() => {
              if (!reason) return;
              onConfirm(reason, note.trim());
              setReason(null);
              setNote("");
            }}
          >
            Marcar como perdido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
