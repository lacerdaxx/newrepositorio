# AutoCRM

CRM SaaS multi-tenant e white-label para lojas de veículos seminovos. Sem APIs externas: todo contato via WhatsApp usa links `wa.me` e o único backend é o Supabase.

## Stack

Next.js 15 (App Router) · TypeScript estrito · Tailwind CSS v4 · componentes no padrão shadcn/ui (Radix) · Framer Motion · Supabase · dnd-kit · Recharts · Zod + React Hook Form · TanStack Query · Papaparse · Lucide · Vercel.

## Rodando localmente

```bash
cd autocrm
npm install
npm run dev                  # http://localhost:3000
```

Sem `.env.local`, o app abre em **modo demonstração** (dados fictícios, sem login, nada é salvo). Para usar de verdade, configure o Supabase:

### 1. Supabase

**Opção A: projeto na nuvem**
1. Crie um projeto em [supabase.com](https://supabase.com) (região São Paulo).
2. Aplique as migrations:
   ```bash
   npx supabase login
   npx supabase link --project-ref <ref-do-projeto>
   npx supabase db push
   ```
3. Em *Authentication → Providers → Email*, **desative "Allow new users to sign up"** (as contas são criadas pela agência/gerente).
4. Em *Authentication → URL Configuration*, adicione `https://*.meudominio.com.br/**` às Redirect URLs.

**Opção B: local** (requer Docker): `npx supabase start` e depois `npx supabase db reset`.

Depois copie as chaves:

```bash
cp .env.example .env.local   # URL, anon key e service role key (Settings → API)
npm run db:seed              # agência + 2 lojas de exemplo com equipe (senha: autocrm123)
```

Login da agência: `agencia@autocrm.dev` / `autocrm123`.

### 2. Lojas e subdomínios em desenvolvimento

- `http://localhost:3000/?loja=abc-multimarcas` fixa a loja num cookie (troque o slug para mudar de loja).
- `http://localhost:3000/?loja=agencia` abre o painel da agência.
- Ou use `http://abc-multimarcas.localhost:3000`, que os navegadores resolvem sem configurar DNS.

### 3. Deploy na Vercel com subdomínios

1. Importe o repositório na Vercel com **Root Directory = `autocrm`**.
2. Cadastre as variáveis do `.env.example` (com `NEXT_PUBLIC_ROOT_DOMAIN=meudominio.com.br`).
3. Em *Settings → Domains*, adicione `meudominio.com.br` e o curinga `*.meudominio.com.br`. O curinga exige os nameservers do domínio apontando para a Vercel (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`).
4. Cada loja passa a responder em `https://{slug}.meudominio.com.br`; o domínio raiz abre o painel da agência.
5. Domínio próprio da loja (opcional): cadastre em *Painel da agência → loja → Endereço e status*, crie um CNAME `cname.vercel-dns.com` e adicione o domínio no projeto da Vercel.

A sessão é compartilhada entre os subdomínios (cookie em `.meudominio.com.br`), então a agência navega entre lojas sem logar de novo.

### Scripts

| Script | O que faz |
| --- | --- |
| `npm run build` / `npm run typecheck` / `npm run lint` | Build, tipos e lint |
| `npm run db:test` | Aplica as migrations num Postgres descartável e roda os testes de RLS (`PGHOST`, `PGPORT`, `PGUSER`) |
| `npm run db:seed` | Cria agência, lojas de exemplo e usuários |

## Multi-tenant e segurança

- Toda tabela de negócio tem `tenant_id` e **RLS habilitado** (`supabase/migrations`).
- Papéis: `superadmin` (agência, vê todas as lojas), `gerente` (tudo da loja), `vendedor` (só os próprios leads, tarefas e timeline).
- Loja desativada: os usuários dela perdem acesso a todos os dados; nada é apagado.
- Papel e loja do usuário ficam em `app_metadata` (só o service role altera), nunca em `user_metadata`.
- Colunas sensíveis (papel, subdomínio, status da loja) são protegidas por triggers, além do RLS.
- Visitantes anônimos não leem tabelas: o formulário público e o catálogo usam funções `SECURITY DEFINER` específicas.
- `supabase/tests/rls.test.sql` cobre isolamento entre lojas, papéis, deduplicação, motivo de perda obrigatório e loja desativada.

## Estrutura

```
supabase/
  migrations/          schema, RLS, triggers, RPCs, storage (versionadas)
  tests/               testes de RLS em Postgres puro
scripts/seed.mjs       dados iniciais
src/
  app/                 rotas (App Router); (app)/ = área logada com sidebar
  components/
    ui/                primitivos do design system (button, card, dialog, command…)
    layout/            shell: sidebar, topbar, command palette, atalhos, transições
    brand/             logo do tenant e ícones de marcas (WhatsApp, Instagram, Meta)
  features/            código por domínio (tenants, auth, users, admin, leads, pipeline…)
  middleware.ts        subdomínio → loja + renovação da sessão Supabase
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
2. ✅ Banco, Auth, multi-tenant, RLS, papéis, superadmin, tema dinâmico
3. Funil Kanban + ficha do lead + estoque + página pública do veículo
4. Formulário público, catálogo, importação CSV, cadastro rápido, rodízio
5. Templates WhatsApp (wa.me), notificações realtime/push, compartilhar no grupo
6. Automações internas, follow-ups, tarefas e "Meu dia"
7. Dashboard e relatórios (CSV + PDF)
8. Polimento: animações, estados vazios, mobile/PWA, performance, acessibilidade
