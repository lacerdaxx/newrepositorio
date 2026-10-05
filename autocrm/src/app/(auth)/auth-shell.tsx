"use client";
import { motion } from "framer-motion";
import { TenantMark } from "@/components/brand/tenant-logo";
import { useTenant } from "@/features/tenants/tenant-provider";
import { transition } from "@/lib/motion";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const tenant = useTenant();
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center gap-2.5">
          <TenantMark className="size-8" />
          <span className="text-[15px] font-semibold tracking-tight">{tenant.name}</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition.base}
          className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12"
        >
          {children}
        </motion.div>
        <p className="text-xs text-subtle-foreground">© {new Date().getFullYear()} {tenant.name}</p>
      </div>

      <div className="relative hidden overflow-hidden border-l border-border bg-surface-2 lg:block">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(900px circle at 85% 10%, color-mix(in oklch, var(--brand) 38%, transparent), transparent 55%), radial-gradient(700px circle at 10% 90%, color-mix(in oklch, var(--brand) 22%, transparent), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(circle at 50% 40%, black, transparent 75%)",
          }}
        />
        <div className="relative flex h-full flex-col justify-end p-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition.base, delay: 0.1 }}
            className="surface max-w-md rounded-2xl border border-border bg-surface/80 p-6 shadow-lg backdrop-blur"
          >
            <p className="text-lg font-semibold leading-snug tracking-tight text-balance">
              Cada lead atendido no tempo certo vira visita. Cada visita bem conduzida vira venda.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Funil, estoque e WhatsApp da {tenant.name} em um só lugar.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
