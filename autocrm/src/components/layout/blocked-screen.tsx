import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BlockedScreen({
  title,
  description,
  signOut,
}: {
  title: string;
  description: string;
  signOut?: boolean;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground">
        <ShieldAlert className="size-5" />
      </div>
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {signOut && (
        <form action="/auth/sair" method="post" className="mt-6">
          <Button variant="secondary" type="submit">
            Sair e entrar com outra conta
          </Button>
        </form>
      )}
    </div>
  );
}
