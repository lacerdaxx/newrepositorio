"use client";
import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound, Minus, MoreHorizontal, Plus, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import { useCurrentUser } from "@/features/auth/user-provider";
import { fadeUpItem, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ProfileRow } from "@/types/database";
import { updateUserAction } from "../actions";
import { ROLE_LABEL, type UpdateUserInput } from "../schemas";
import { NewUserDialog } from "./new-user-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";

type Patch = Omit<UpdateUserInput, "tenantId">;

export function UsersManager({ tenantId, users }: { tenantId: string; users: ProfileRow[] }) {
  const router = useRouter();
  const me = useCurrentUser();
  const [, startTransition] = useTransition();
  const [newOpen, setNewOpen] = useState(false);
  const [resetFor, setResetFor] = useState<ProfileRow | null>(null);
  const [optimistic, applyOptimistic] = useOptimistic(users, (state, patch: Patch) =>
    state.map((u) =>
      u.id === patch.userId
        ? {
            ...u,
            role: patch.role ?? u.role,
            active: patch.active ?? u.active,
            receives_leads: patch.receivesLeads ?? u.receives_leads,
            distribution_weight: patch.distributionWeight ?? u.distribution_weight,
          }
        : u,
    ),
  );

  function update(patch: Patch) {
    startTransition(async () => {
      applyOptimistic(patch);
      const res = await updateUserAction({ ...patch, tenantId });
      if (!res.ok) toast.error(res.error);
      router.refresh();
    });
  }

  const sellers = optimistic.filter((u) => u.active && u.receives_leads && u.distribution_weight > 0);
  const totalWeight = sellers.reduce((s, u) => s + u.distribution_weight, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {optimistic.filter((u) => u.active).length} ativos · {sellers.length} no rodízio de leads
        </p>
        <Button onClick={() => setNewOpen(true)}>
          <UserPlus /> Novo usuário
        </Button>
      </div>

      {optimistic.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title="Nenhum usuário"
          description="Crie o primeiro gerente ou vendedor da loja."
          action={<Button onClick={() => setNewOpen(true)}><UserPlus /> Novo usuário</Button>}
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="hidden grid-cols-[minmax(0,1fr)_140px_170px_80px_40px] gap-4 border-b border-border bg-surface-2/60 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-subtle-foreground md:grid">
            <span>Usuário</span>
            <span>Papel</span>
            <span>Rodízio de leads</span>
            <span>Ativo</span>
            <span />
          </div>
          <motion.ul variants={staggerContainer(0.03)} initial="hidden" animate="show">
            {optimistic.map((u) => {
              const share = u.active && u.receives_leads && totalWeight ? u.distribution_weight / totalWeight : 0;
              const isMe = u.id === me.id;
              return (
                <motion.li
                  key={u.id}
                  variants={fadeUpItem}
                  className={cn(
                    "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 border-b border-border px-4 py-3 last:border-0 md:grid-cols-[minmax(0,1fr)_140px_170px_80px_40px]",
                    !u.active && "opacity-55",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={u.full_name || u.email} src={u.avatar_url} className="size-8" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 truncate text-[13px] font-medium">
                        {u.full_name || "—"}
                        {isMe && <Badge variant="outline">você</Badge>}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>

                  <div className="col-span-2 row-start-2 md:col-span-1 md:row-start-auto">
                    <Select
                      value={u.role}
                      disabled={isMe || u.role === "superadmin"}
                      onValueChange={(v) => update({ userId: u.id, role: v as "gerente" | "vendedor" })}
                    >
                      <SelectTrigger className="h-8 text-[13px]" aria-label="Papel">
                        <SelectValue>{ROLE_LABEL[u.role]}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gerente">Gerente</SelectItem>
                        <SelectItem value="vendedor">Vendedor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 row-start-3 flex items-center gap-2 md:col-span-1 md:row-start-auto">
                    <Tooltip content={u.receives_leads ? "Recebe leads no rodízio" : "Fora do rodízio"}>
                      <span>
                        <Switch
                          checked={u.receives_leads}
                          disabled={!u.active}
                          onCheckedChange={(v) => update({ userId: u.id, receivesLeads: v })}
                          aria-label="Recebe leads"
                        />
                      </span>
                    </Tooltip>
                    <div className={cn("flex items-center rounded-md border border-border", !u.receives_leads && "opacity-40")}>
                      <button
                        type="button"
                        className="flex size-6 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                        disabled={!u.receives_leads || u.distribution_weight <= 0}
                        onClick={() => update({ userId: u.id, distributionWeight: u.distribution_weight - 1 })}
                        aria-label="Diminuir peso"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-medium tabular">{u.distribution_weight}</span>
                      <button
                        type="button"
                        className="flex size-6 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                        disabled={!u.receives_leads || u.distribution_weight >= 10}
                        onClick={() => update({ userId: u.id, distributionWeight: u.distribution_weight + 1 })}
                        aria-label="Aumentar peso"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <span className="text-xs text-subtle-foreground tabular">{Math.round(share * 100)}%</span>
                  </div>

                  <div className="row-start-1 flex justify-end md:row-start-auto md:justify-start">
                    <Switch
                      checked={u.active}
                      disabled={isMe}
                      onCheckedChange={(v) => update({ userId: u.id, active: v })}
                      aria-label="Usuário ativo"
                    />
                  </div>

                  <div className="hidden md:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs" aria-label="Mais ações">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setResetFor(u)}>
                          <KeyRound /> Redefinir senha
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        </Card>
      )}

      <NewUserDialog tenantId={tenantId} open={newOpen} onOpenChange={setNewOpen} />
      <ResetPasswordDialog tenantId={tenantId} user={resetFor} onClose={() => setResetFor(null)} />
    </div>
  );
}
