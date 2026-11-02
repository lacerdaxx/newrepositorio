# Multi Car Veículos — Mega Feirão de Aniversário (Landing Page)

React + TypeScript + Vite + Tailwind + Framer Motion + GSAP ScrollTrigger + Three.js (React Three Fiber).

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # produção (dist/)
```

## Configuração (nada foi inventado — preencha o que falta)
- `src/config/site.ts`: datas do evento, textos legais, ofertas, marcas e **estoque** (`stock`: adicione `name` e `image` reais).
- `.env` (copie de `.env.example`): `VITE_LEAD_WEBHOOK_URL` (CRM/webhook, POST JSON), `VITE_WHATSAPP_NUMBER`, `VITE_INSTAGRAM_URL`, `VITE_PRIVACY_URL`.
  Sem webhook configurado o formulário valida, mas **não envia nem simula sucesso**.
- Logotipo: coloque o arquivo em `public/` e defina `LOGO_SRC` em `src/components/ui/Logo.tsx` (hoje é um logo provisório).
- Imagens de veículos: os cards usam silhueta placeholder até receberem `image`. O carro 3D do hero é uma silhueta procedural genérica (não é modelo real); para um modelo real, troque `Car` em `components/three/HeroScene.tsx` por um GLB.
- `public/og-image.svg`: para Open Graph em redes sociais use PNG 1200x630 com URL absoluta.

## Performance/acessibilidade
3D carregado sob demanda (lazy, após primeiro paint), fallback sem WebGL, DPR/partículas reduzidos no mobile, `prefers-reduced-motion` respeitado, formulário com rótulos, erros anunciados e foco visível.
