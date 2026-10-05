import { redirect } from "next/navigation";
import { getTenantContext } from "@/features/tenants/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const ctx = await getTenantContext();
  redirect(ctx.kind === "agency" ? "/admin" : "/meu-dia");
}
