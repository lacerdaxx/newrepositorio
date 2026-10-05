import { redirect } from "next/navigation";
import { requireUser } from "@/features/auth/server";
import { VehicleEditor } from "@/features/vehicles/components/vehicle-editor";

export const metadata = { title: "Cadastrar veículo" };

export default async function NovoVeiculoPage() {
  const user = await requireUser();
  if (user.role === "vendedor") redirect("/estoque");
  return <VehicleEditor vehicleId={null} />;
}
