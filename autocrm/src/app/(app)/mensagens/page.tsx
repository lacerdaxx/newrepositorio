import { MessageSquareText } from "lucide-react";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Mensagens" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Central de mensagens"
      description="Templates de WhatsApp com variáveis, enviados via wa.me (sem API)."
      icon={<MessageSquareText />}
      emptyTitle="Nenhum template criado"
      emptyDescription="Use {nome}, {veiculo}, {vendedor} e {loja}. Cada envio é registrado na timeline do lead."
      phase={5}
    />
  );
}
