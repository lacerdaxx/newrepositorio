# Multi Car Veículos — Mega Feirão de Aniversário

Landing page "PRECISION AUTOMOTIVE — MULTI CAR". React + TypeScript + Vite + Tailwind v4 + GSAP/ScrollTrigger + Motion.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # typecheck + build de produção (dist/)
```

## O que falta para ir ao ar (não inventei nada disso)

1. **Fotografias reais.** Não há imagens de veículos no repositório e não criei imagens artificiais.
   Coloque os originais em `photos-src/` com os nomes `hero`, `byd`, `citroen`, `peugeot`, `ford`, `nissan`
   (`.jpg/.png`, ideal 2560px de largura) e rode `npm run photos` — gera AVIF/WebP responsivos em `public/photos/`.
   Enquanto o arquivo não existe, a página mostra um traço técnico (hero) e o nome da marca (estoque).
   Ajuste os textos `alt` em `src/data/content.ts`. Use apenas fotos de veículos reais, com direitos de uso.
2. **Integração do formulário.** Copie `.env.example` para `.env` e defina `VITE_LEAD_WEBHOOK_URL`.
   O formulário envia `POST` JSON: `name, whatsapp (+55…), vehicleInterest, hasTradeIn, consent, consentText,
   source, pageUrl, referrer, submittedAt` + parâmetros UTM/gclid/fbclid. Sem URL configurada, o formulário
   **não simula envio**: informa que o envio não está ativo. `VITE_WHATSAPP_NUMBER` (opcional) adiciona um link
   alternativo de WhatsApp na mensagem de falha. O endpoint precisa aceitar CORS do domínio da página.
3. **Dados da loja** (endereço, telefone, política de privacidade) não foram fornecidos e não aparecem na página.
   Se houver condições legais das ofertas (ex.: sujeitas a análise de crédito), inclua-as — não adicionei nenhuma.
4. `VITE_SITE_URL` / canonical / imagem OG: defina ao publicar o domínio.

## Estrutura

- `src/components/Extrude.tsx` — texto 3D real (camadas empilhadas em `translateZ`, face metálica, sombra de contato).
  Usado só no título, no R$ 299,99 e no R$ 5.000. Sem Three.js: o peso não se justifica para letras extrudadas.
- `Hero` (abertura em máscara, câmera com parallax, tilt do 3D com o mouse), `Offers` (palco fixo no desktop com
  cortes entre as 3 ofertas; empilhado no mobile), `Showroom` (grade assimétrica, máscaras e parallax interno), `Lead`.
- `prefers-reduced-motion`: nenhuma animação nem pin; layout empilhado estático.
