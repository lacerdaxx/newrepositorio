import { EmptyState } from "@/components/ui/empty-state";
import { PageBody, PageHeader } from "./page-header";

export function ModulePlaceholder({
  title,
  description,
  icon,
  emptyTitle,
  emptyDescription,
  action,
  phase,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  emptyTitle: string;
  emptyDescription: string;
  action?: React.ReactNode;
  phase: number;
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <PageBody>
        <EmptyState
          icon={icon}
          title={emptyTitle}
          description={
            <>
              {emptyDescription}
              <span className="mt-2 block text-xs text-subtle-foreground">Módulo construído na Fase {phase}.</span>
            </>
          }
          action={action}
        />
      </PageBody>
    </>
  );
}
