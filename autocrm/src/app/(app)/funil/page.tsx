import { Suspense } from "react";
import { PipelineBoard } from "@/features/pipeline/components/pipeline-board";

export const metadata = { title: "Funil" };

export default function FunilPage() {
  return (
    <Suspense>
      <PipelineBoard />
    </Suspense>
  );
}
