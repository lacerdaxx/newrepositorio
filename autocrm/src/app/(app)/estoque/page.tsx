import Link from "next/link";
import { Plus } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/features/auth/server";
import { VehicleGrid } from "@/features/vehicles/components/vehicle-grid";

export const metadata = { title: "Estoque" };

export default async function EstoquePage() {
  const user = await requireUser();
  return (
    <>
      <PageHeader
        title="Estoque"
        description="Veículos da loja, com página pública compartilhável e leads interessados."
        actions={
          user.role !== "vendedor" && (
            <Button asChild>
              <Link href="/estoque/novo">
                <Plus /> Cadastrar veículo
              </Link>
            </Button>
          )
        }
      />
      <PageBody>
        <VehicleGrid />
      </PageBody>
    </>
  );
}
