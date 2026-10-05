import { PageBody, PageHeader } from "@/components/layout/page-header";
import { DesignShowcase } from "./showcase";

export const metadata = { title: "Design system" };

export default function DesignPage() {
  return (
    <>
      <PageHeader title="Design system" description="Componentes base do AutoCRM, já com a cor da loja aplicada." />
      <PageBody>
        <DesignShowcase />
      </PageBody>
    </>
  );
}
