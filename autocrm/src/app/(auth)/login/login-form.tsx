"use client";
import { useActionState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Info, Loader2 } from "lucide-react";
import { signInAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({ next, demo }: { next?: string; demo: boolean }) {
  const [state, action, pending] = useActionState(signInAction, null);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Acesse o painel com seu e-mail e senha.</p>

      {demo && (
        <div className="mt-6 flex gap-2.5 rounded-lg border border-border bg-surface-2 p-3 text-[13px] text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-info" />
          <span>
            Supabase não configurado. Você entrará no <strong className="text-foreground">modo demonstração</strong>,
            com dados fictícios.
          </span>
        </div>
      )}

      <form action={action} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="next" value={next ?? ""} />
        <Field label="E-mail" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="voce@loja.com.br" required={!demo} autoFocus />
        </Field>
        <Field label="Senha" htmlFor="password">
          <Input id="password" name="password" type="password" autoComplete="current-password" required={!demo} placeholder="••••••••" />
        </Field>

        <AnimatePresence>
          {state && !state.ok && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-[13px] text-danger"
            >
              {state.error}
            </motion.p>
          )}
        </AnimatePresence>

        <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
          {pending ? <Loader2 className="animate-spin" /> : null}
          {demo ? "Entrar na demonstração" : "Entrar"}
          {!pending && <ArrowRight />}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted-foreground">
        Esqueceu a senha?{" "}
        <Link href="/recuperar-senha" className="font-medium text-foreground underline-offset-4 hover:underline">
          Recuperar acesso
        </Link>
      </p>
    </div>
  );
}
