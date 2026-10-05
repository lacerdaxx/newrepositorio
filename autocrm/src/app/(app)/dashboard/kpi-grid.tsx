"use client";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Card } from "@/components/ui/card";
import { fadeUpItem, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type Kpi = {
  label: string;
  value: number;
  format?: "int" | "currency" | "percent" | "minutes";
  delta?: number;
  /** quando true, queda é positiva (ex.: tempo de resposta) */
  invert?: boolean;
  icon: React.ReactNode;
  highlight?: boolean;
};

const formatters = {
  int: (n: number) => Math.round(n).toLocaleString("pt-BR"),
  currency: (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }),
  percent: (n: number) => `${n.toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%`,
  minutes: (n: number) => `${Math.round(n)} min`,
};

export function KpiGrid({ items }: { items: Kpi[] }) {
  return (
    <motion.div
      variants={staggerContainer(0.05)}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6"
    >
      {items.map((k) => {
        const good = k.delta === undefined ? null : k.invert ? k.delta < 0 : k.delta > 0;
        return (
          <motion.div key={k.label} variants={fadeUpItem}>
            <Card className={cn("group relative h-full overflow-hidden p-4 transition-shadow hover:shadow-md", k.highlight && "brand-glow")}>
              <div className="flex items-center gap-2 text-[12.5px] font-medium text-muted-foreground">
                <span className="text-subtle-foreground [&_svg]:size-3.5">{k.icon}</span>
                {k.label}
              </div>
              <div className="mt-2.5 text-[26px] font-semibold leading-none tracking-tight">
                <AnimatedNumber value={k.value} format={formatters[k.format ?? "int"]} />
              </div>
              {k.delta !== undefined && (
                <div
                  className={cn(
                    "mt-2 flex items-center gap-0.5 whitespace-nowrap text-xs font-medium",
                    good ? "text-success" : "text-danger",
                  )}
                >
                  {k.delta >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                  {Math.abs(k.delta).toLocaleString("pt-BR")}%
                  <span className="ml-1 truncate font-normal text-subtle-foreground">vs. anterior</span>
                </div>
              )}
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
