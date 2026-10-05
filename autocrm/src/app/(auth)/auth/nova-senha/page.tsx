"use client";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { updatePasswordAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function NovaSenhaPage() {
  const [state, action, pending] = useActionState(updatePasswordAction, null);
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Criar nova senha</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Use pelo menos 8 caracteres.</p>
      <form action={action} className="mt-6 flex flex-col gap-4">
        <Field label="Nova senha" htmlFor="password">
          <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} autoFocus />
        </Field>
        <Field label="Confirmar senha" htmlFor="confirm" error={state && !state.ok ? state.error : undefined}>
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={8} />
        </Field>
        <Button type="submit" size="lg" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />} Salvar senha
        </Button>
      </form>
    </div>
  );
}
