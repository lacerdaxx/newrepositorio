import { Bot } from "lucide-react";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Automações" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Automações"
      description="Regras “Quando → Então” executadas dentro do sistema."
      icon={<Bot />}
      emptyTitle="Nenhuma automação ativa"
      emptyDescription="Ex.: quando um lead ficar 15 min sem contato, notificar o gerente e redistribuir."
      phase={6}
    />
  );
}
