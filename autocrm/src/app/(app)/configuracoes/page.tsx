import Link from "next/link";
import { ChevronRight, Clock, FileText, Kanban, MessageSquareText, Palette, Users } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/features/auth/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Configurações" };

const sections = [
  { href: "/configuracoes/marca", icon: Palette, title: "Marca", description: "Logo, cores, WhatsApp e fuso horário, com prévia ao vivo." },
  { href: "/configuracoes/usuarios", icon: Users, title: "Usuários e permissões", description: "Gerentes, vendedores e peso no rodízio de leads." },
  { href: null, icon: Kanban, title: "Funis e etapas", description: "Etapas, cores e múltiplos funis.", phase: 3 },
  { href: null, icon: FileText, title: "Formulário público", description: "Campos, textos e link do grupo de ofertas.", phase: 4 },
  { href: null, icon: Clock, title: "Expediente e distribuição", description: "Horários, ausências e regras do rodízio.", phase: 4 },
  { href: null, icon: MessageSquareText, title: "Templates de mensagem", description: "Mensagens de WhatsApp com variáveis.", phase: 5 },
];

export default async function ConfiguracoesPage() {
  const user = await requireUser();
  if (user.role === "vendedor") redirect("/meu-dia");
  return (
    <>
      <PageHeader title="Configurações da loja" description="Personalize o CRM para a sua equipe." />
      <PageBody className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((s) => {
          const inner = (
            <Card className="group flex h-full items-start gap-3 p-4 transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-md">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2 text-brand">
                <s.icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[13px] font-semibold">
                  {s.title}
                  {s.phase && <Badge variant="outline">Fase {s.phase}</Badge>}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
              </div>
              {s.href && <ChevronRight className="size-4 text-subtle-foreground transition-transform group-hover:translate-x-0.5" />}
            </Card>
          );
          return s.href ? (
            <Link key={s.title} href={s.href} className="rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
              {inner}
            </Link>
          ) : (
            <div key={s.title} className="opacity-60">
              {inner}
            </div>
          );
        })}
      </PageBody>
    </>
  );
}
