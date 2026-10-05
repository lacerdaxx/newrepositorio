import { CarFront } from "lucide-react";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Estoque" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Estoque de veículos"
      description="Cadastre veículos com fotos e compartilhe a página pública de cada um."
      icon={<CarFront />}
      emptyTitle="Nenhum veículo cadastrado"
      emptyDescription="Cada veículo ganha uma página pública com a marca da loja e botão “Tenho interesse”."
      phase={3}
    />
  );
}
