import { CalendarCheck } from "lucide-react";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata = { title: "Tarefas" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Tarefas e agenda"
      description="Visitas, test drives e follow-ups em lista ou calendário."
      icon={<CalendarCheck />}
      emptyTitle="Nenhuma tarefa agendada"
      emptyDescription="Tarefas criadas na ficha do lead e pelas cadências D+1, D+3 e D+7 aparecem aqui."
      phase={6}
    />
  );
}
