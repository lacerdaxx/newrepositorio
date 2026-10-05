import Link from "next/link";
import { BellRing, CalendarCheck, PhoneMissed, Plus, Repeat } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/features/auth/server";

export const metadata = { title: "Meu dia" };

function greeting(date = new Date()) {
  const h = Number(date.toLocaleString("pt-BR", { hour: "2-digit", hour12: false, timeZone: "America/Sao_Paulo" }));
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

const sections = [
  { title: "Tarefas de hoje", icon: CalendarCheck, empty: "Nenhuma tarefa para hoje." },
  { title: "Leads sem contato", icon: PhoneMissed, empty: "Todos os leads foram atendidos.", tone: "danger" as const },
  { title: "Follow-ups pendentes", icon: Repeat, empty: "Nenhum follow-up pendente." },
];

export default async function MeuDiaPage() {
  const user = await requireUser();
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Sao_Paulo",
  });
  return (
    <>
      <PageHeader
        title={`${greeting()}, ${user.name.split(" ")[0]}`}
        description={<span className="capitalize">{today}</span>}
        actions={
          <Button asChild>
            <Link href="/funil">
              <Plus /> Abrir funil
            </Link>
          </Button>
        }
      />
      <PageBody className="grid gap-4 lg:grid-cols-3">
        {sections.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5 text-foreground">
                <s.icon className="size-4 text-subtle-foreground" /> {s.title}
              </CardTitle>
              <Badge variant={s.tone ?? "default"}>0</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
                <BellRing className="size-4 text-subtle-foreground" />
                {s.empty}
              </div>
            </CardContent>
          </Card>
        ))}
      </PageBody>
    </>
  );
}
