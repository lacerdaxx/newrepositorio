"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateOwnProfileAction } from "../actions";

export function ProfileForm({ defaultName }: { defaultName: string }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(defaultName);
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <Card className="max-w-lg p-5">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            const res = await updateOwnProfileAction({ fullName, password });
            if (!res.ok) return void toast.error(res.error);
            toast.success(res.message ?? "Salvo");
            setPassword("");
            router.refresh();
          });
        }}
      >
        <Field label="Nome" htmlFor="pf-name" hint="Usado na variável {vendedor} das mensagens de WhatsApp.">
          <Input id="pf-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </Field>
        <Field label="Nova senha" htmlFor="pf-pass" hint="Deixe em branco para manter a atual." optional>
          <Input id="pf-pass" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="animate-spin" />} Salvar
          </Button>
        </div>
      </form>
    </Card>
  );
}
