import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="font-mono text-sm text-subtle-foreground">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">Página não encontrada</h1>
      <p className="max-w-sm text-sm text-muted-foreground">O endereço pode ter mudado ou o link está incorreto.</p>
      <Button asChild className="mt-2">
        <Link href="/meu-dia">Voltar ao início</Link>
      </Button>
    </div>
  );
}
