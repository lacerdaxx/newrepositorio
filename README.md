# BuildScale Company — Landing Page

Landing page de captação (Next.js 14 + TypeScript + Tailwind + Framer Motion) para a BuildScale Company — *Growth Marketing for Construction Companies*.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
```

## O que trocar (tudo em `src/config/site.ts`)

| Item | Campo |
| --- | --- |
| WhatsApp que recebe os leads | `whatsapp` — só dígitos, com DDI (ex.: `5561999999999` ou `15085551234`) |
| Meta Pixel | `metaPixelId` — enquanto estiver `[ID DO PIXEL]` o pixel não carrega |
| Depoimentos | `depoimentos` — `quote`, `name`, `company`, `location`, `result` e, opcional, `photo` (ex.: `/depoimentos/joao.jpg` em `public/`) |
| Vídeo do hero | `heroVideoUrl` — URL de um `.mp4` vertical (vazio = mostra o placeholder) |
| Domínio (SEO/Open Graph) | `url` |

## Logo e favicon

- Coloque o arquivo em `public/logo.png`. Ele passa a ser usado no header, no footer e na imagem de Open Graph automaticamente (refaça o build).
- Sem `logo.png`, o site usa o placeholder `public/logo-placeholder.svg`.
- Favicon: `src/app/icon.svg` (ícone das barras). Para usar outro, substitua esse arquivo ou apague-o e coloque um `src/app/icon.png` quadrado.

## Publicar na Vercel

```bash
npx vercel          # primeira vez: faz login e cria o projeto (preview)
npx vercel --prod   # publica em produção
```

Ou importe o repositório em vercel.com/new — o framework Next.js é detectado sozinho.

## Estrutura

```
src/config/site.ts        configuração central
src/app/                  layout (fontes, SEO, pixel), página, /privacidade, OG image, favicon
src/components/           Header, Hero, Marquee, Pain, HowItWorks, Included, TheMath,
                          Testimonials, ForWho, DiagnosticForm, Faq, FinalCta, Footer, WhatsAppFloat
src/components/ui/        Button, Tag, Reveal, SpotlightCard, GrowthBars, Logo…
```
