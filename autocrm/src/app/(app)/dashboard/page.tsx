import { CalendarRange, Clock, Flame, Percent, TrendingUp, UserPlus, Users } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiGrid, type Kpi } from "./kpi-grid";

export const metadata = { title: "Dashboard" };

// Valores de demonstração — substituídos por consultas reais na Fase 7
const kpis: Kpi[] = [
  { label: "Leads hoje", value: 18, delta: 12, icon: <UserPlus />, highlight: true },
  { label: "Leads na semana", value: 96, delta: 8, icon: <Users /> },
  { label: "Leads no mês", value: 412, delta: -3, icon: <CalendarRange /> },
  { label: "1º contato (média)", value: 7, format: "minutes", delta: -22, invert: true, icon: <Clock /> },
  { label: "Conversão", value: 6.8, format: "percent", delta: 1.4, icon: <Percent /> },
  { label: "Vendas no mês", value: 28, delta: 17, icon: <TrendingUp /> },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral do desempenho da loja."
        actions={
          <>
            <Badge variant="warning">Dados de demonstração</Badge>
            <Button variant="secondary" size="sm">
              <CalendarRange /> Este mês
            </Button>
          </>
        }
      />
      <PageBody className="flex flex-col gap-4">
        <KpiGrid items={kpis} />
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Leads por origem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-56 items-end gap-2">
                {[64, 38, 82, 45, 70, 30, 55, 90, 48, 66, 40, 75].map((h, i) => (
                  <Skeleton key={i} className="flex-1 rounded-t-md rounded-b-none" style={{ height: `${h}%` }} />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5">
                <Flame className="size-3.5 text-brand" /> Ranking de vendedores
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-7 rounded-full" />
                  <Skeleton className="h-3 flex-1" />
                  <Skeleton className="h-3 w-10" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
