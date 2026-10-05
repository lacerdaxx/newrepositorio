import { Kanban } from "lucide-react";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Funil" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Funil de vendas"
      description="Arraste os leads entre as etapas do atendimento."
      icon={<Kanban />}
      emptyTitle="Seu funil aparecerá aqui"
      emptyDescription="Novo Lead → Em Atendimento → Qualificado → Visita → Proposta → Vendido/Perdido, com múltiplos funis por loja."
      phase={3}
    />
  );
}
