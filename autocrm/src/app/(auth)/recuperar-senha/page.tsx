"use client";
import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { requestPasswordResetAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function RecuperarSenhaPage() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, null);

  if (state?.ok) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl border border-border bg-surface text-brand">
          <MailCheck className="size-5" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Verifique seu e-mail</h1>
        <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
        <Button asChild variant="secondary" className="mt-6">
          <Link href="/login">Voltar ao login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Link href="/login" className="mb-6 inline-flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Voltar
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Recuperar acesso</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Enviaremos um link para você criar uma nova senha.</p>
      <form action={action} className="mt-6 flex flex-col gap-4">
        <Field label="E-mail" htmlFor="email" error={state && !state.ok ? state.error : undefined}>
          <Input id="email" name="email" type="email" required autoFocus placeholder="voce@loja.com.br" />
        </Field>
        <Button type="submit" size="lg" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />} Enviar link
        </Button>
      </form>
    </div>
  );
}
