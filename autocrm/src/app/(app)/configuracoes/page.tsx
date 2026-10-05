import { Settings } from "lucide-react";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Configurações" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Configurações da loja"
      description="Marca, usuários, funis, templates, formulário público e distribuição."
      icon={<Settings />}
      emptyTitle="Configurações"
      emptyDescription="Marca com preview ao vivo, horário de expediente e regras de rodízio."
      phase={2}
    />
  );
}
