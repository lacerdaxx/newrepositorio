"use client";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ProfileRow } from "@/types/database";
import { resetUserPasswordAction } from "../actions";

export function ResetPasswordDialog({
  tenantId,
  user,
  onClose,
}: {
  tenantId: string;
  user: ProfileRow | null;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <Dialog
      open={!!user}
      onOpenChange={(o) => {
        if (!o) {
          setPassword("");
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Redefinir senha</DialogTitle>
          <DialogDescription>Nova senha para {user?.full_name || user?.email}.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!user) return;
            startTransition(async () => {
              const res = await resetUserPasswordAction({ userId: user.id, tenantId, password });
              if (!res.ok) return void toast.error(res.error);
              toast.success(res.message ?? "Senha redefinida");
              setPassword("");
              onClose();
            });
          }}
          className="flex flex-col gap-4"
        >
          <Field label="Nova senha" htmlFor="rp-pass" hint="Mínimo de 8 caracteres.">
            <Input id="rp-pass" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
          </Field>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={pending || password.length < 8}>
              {pending && <Loader2 className="animate-spin" />} Redefinir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
