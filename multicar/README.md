# Mega Feirão de Aniversário — Multi Car Veículos

React + TypeScript + Vite + Tailwind v4 + GSAP/ScrollTrigger. Sem Three.js: o texto 3D é extrusão em CSS (camadas), leve e nítido.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # produção (dist/)
```

## O que você precisa fornecer

**Fotografias reais** (não geradas) em `public/images/`:
`hero.jpg` (carro em estúdio, fundo escuro, espaço à esquerda para o título), `byd.jpg`, `citroen.jpg`, `peugeot.jpg`, `ford.jpg`, `nissan.jpg`.
Enquanto faltarem, a página mostra painéis escuros identificados — nenhum carro falso. Use JPG/WebP otimizado (hero ≤ 250 KB, ~2400px).

**Integração do formulário** — copie `.env.example` para `.env` e defina `VITE_LEAD_WEBHOOK_URL` (POST JSON: nome, whatsapp, veiculo_interesse, possui_usado_troca, consentimento_lgpd, UTMs). Sem a variável, o formulário valida mas **não finge enviar**: informa que o envio está inativo. `VITE_WHATSAPP_NUMBER` (opcional) adiciona link de WhatsApp nesse aviso.

## Notas
- `prefers-reduced-motion`: todas as animações GSAP são desativadas.
- Logo oficial não foi fornecida: o wordmark "MULTI/CAR" é tipográfico; troque em `Header.tsx`/`Footer.tsx`.
- Endereço, telefone e condições adicionais não foram inventados.
