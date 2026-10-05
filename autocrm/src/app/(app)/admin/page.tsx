import { Shield } from "lucide-react";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Agência" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Painel da agência"
      description="Gerencie todas as lojas: marca, usuários, ativação e métricas consolidadas."
      icon={<Shield />}
      emptyTitle="Nenhuma loja cadastrada"
      emptyDescription="Crie a primeira loja, configure a marca e convide o gerente."
      phase={2}
    />
  );
}
