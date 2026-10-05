import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

export function SettingsHeader({ title, description }: { title: string; description: string }) {
  return (
    <PageHeader
      title={title}
      description={
        <span className="flex flex-col gap-1">
          <Link href="/configuracoes" className="inline-flex items-center gap-1 text-xs hover:text-foreground">
            <ArrowLeft className="size-3" /> Configurações
          </Link>
          {description}
        </span>
      }
    />
  );
}
