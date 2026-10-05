# AutoCRM

CRM SaaS multi-tenant e white-label para lojas de veículos seminovos. Sem APIs externas: todo contato via WhatsApp usa links `wa.me` e o único backend é o Supabase.

## Stack

Next.js 15 (App Router) · TypeScript estrito · Tailwind CSS v4 · componentes no padrão shadcn/ui (Radix) · Framer Motion · Supabase · dnd-kit · Recharts · Zod + React Hook Form · TanStack Query · Papaparse · Lucide · Vercel.

## Rodando localmente

```bash
cd autocrm
cp .env.example .env.local   # preencha as chaves do Supabase (Fase 2)
npm install
npm run dev                  # http://localhost:3000
```

Scripts: `npm run build`, `npm run typecheck`, `npm run lint`.

## Estrutura

```
src/
  app/                 rotas (App Router); (app)/ = área logada com sidebar
  components/
    ui/                primitivos do design system (button, card, dialog, command…)
    layout/            shell: sidebar, topbar, command palette, atalhos, transições
    brand/             logo do tenant e ícones de marcas (WhatsApp, Instagram, Meta)
  features/            código por domínio (tenants, auth, leads, pipeline…)
  config/nav.ts        navegação + papéis com acesso
  lib/                 utilitários (formatação BR, cores, presets de animação)
  hooks/               hooks reutilizáveis (atalhos de teclado…)
```

## Tema white-label

A cor primária da loja vira a CSS variable `--brand` (e `--brand-foreground`, calculada para contraste). Ela é injetada no HTML inicial (`tenantStyleTag`) para não haver "flash" de cor. Neutros, bordas e superfícies são tokens em OKLCH com variantes dark/light em `src/app/globals.css`. Dark é o padrão; o usuário pode escolher Claro, Escuro ou Sistema.

## Atalhos

| Atalho | Ação |
| --- | --- |
| `Ctrl/⌘ K` ou `/` | Paleta de comandos (buscar leads, veículos, navegar) |
| `N` | Novo lead |
| `[` | Recolher/expandir menu |
| `Shift T` | Alternar tema |
| `G` + `M/D/F/L/T/E/W/R/S` | Ir para Meu dia, Dashboard, Funil, Leads, Tarefas, Estoque, Mensagens, Relatórios, Configurações |

## Roadmap por fases

1. ✅ Setup, design system, layout com sidebar, dark/light, command palette
2. Banco, Auth, multi-tenant, RLS, papéis, superadmin, tema dinâmico
3. Funil Kanban + ficha do lead + estoque + página pública do veículo
4. Formulário público, catálogo, importação CSV, cadastro rápido, rodízio
5. Templates WhatsApp (wa.me), notificações realtime/push, compartilhar no grupo
6. Automações internas, follow-ups, tarefas e "Meu dia"
7. Dashboard e relatórios (CSV + PDF)
8. Polimento: animações, estados vazios, mobile/PWA, performance, acessibilidade
