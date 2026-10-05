import {
  Bot,
  CalendarCheck,
  CarFront,
  Kanban,
  LayoutDashboard,
  type LucideIcon,
  MessageSquareText,
  PieChart,
  Settings,
  Shield,
  Sun,
  Users,
} from "lucide-react";

export type Role = "superadmin" | "gerente" | "vendedor";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  /** atalho "G + tecla" estilo Linear */
  chord?: string;
  roles?: Role[];
};

export type NavSection = { label?: string; items: NavItem[] };

export const navSections: NavSection[] = [
  {
    items: [
      { title: "Meu dia", href: "/meu-dia", icon: Sun, chord: "m" },
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, chord: "d" },
      { title: "Funil", href: "/funil", icon: Kanban, chord: "f" },
      { title: "Leads", href: "/leads", icon: Users, chord: "l" },
      { title: "Tarefas", href: "/tarefas", icon: CalendarCheck, chord: "t" },
    ],
  },
  {
    label: "Loja",
    items: [
      { title: "Estoque", href: "/estoque", icon: CarFront, chord: "e" },
      { title: "Mensagens", href: "/mensagens", icon: MessageSquareText, chord: "w" },
      { title: "Automações", href: "/automacoes", icon: Bot, roles: ["superadmin", "gerente"] },
      { title: "Relatórios", href: "/relatorios", icon: PieChart, chord: "r", roles: ["superadmin", "gerente"] },
    ],
  },
  {
    label: "Sistema",
    items: [
      { title: "Configurações", href: "/configuracoes", icon: Settings, chord: "s", roles: ["superadmin", "gerente"] },
      { title: "Agência", href: "/admin", icon: Shield, roles: ["superadmin"] },
    ],
  },
];

export const allNavItems = navSections.flatMap((s) => s.items);
