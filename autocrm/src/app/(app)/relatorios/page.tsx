import { PieChart } from "lucide-react";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Relatórios" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Relatórios"
      description="Conversão por etapa, origem, campanha e vendedor. Exportação CSV e PDF."
      icon={<PieChart />}
      emptyTitle="Sem dados para o período"
      emptyDescription="Informe o investimento por campanha para calcular custo por lead e por venda."
      phase={7}
    />
  );
}
