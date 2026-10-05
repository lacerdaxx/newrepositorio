import { Suspense } from "react";
import { VehicleEditor } from "@/features/vehicles/components/vehicle-editor";

export const metadata = { title: "Veículo" };

export default async function VeiculoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <VehicleEditor vehicleId={id} />
    </Suspense>
  );
}
