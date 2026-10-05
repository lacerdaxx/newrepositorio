import { Users } from "lucide-react";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Leads" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Leads"
      description="Todos os contatos da loja, com busca e filtros."
      icon={<Users />}
      emptyTitle="Nenhum lead ainda"
      emptyDescription="Leads chegam pelo formulário público, catálogo, importação CSV do Meta ou cadastro rápido (tecla N)."
      phase={4}
    />
  );
}
