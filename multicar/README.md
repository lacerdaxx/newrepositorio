# Multi Car Veículos — Mega Feirão de Aniversário

Landing page "Precision Automotive" · React + TypeScript + Vite + Tailwind CSS v4 · GSAP/ScrollTrigger · Motion.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # produção (pasta dist/)
```

## O que falta para ir ao ar

1. **Fotografias reais** em `public/photos/` (lista e proporções em `public/photos/README.md`).
   Nenhuma imagem foi inventada/gerada: sem os arquivos, o site mostra um fundo de estúdio neutro com o nome do arquivo pendente.
2. **Webhook/CRM**: copie `.env.example` para `.env` e preencha `VITE_LEAD_WEBHOOK_URL`.
   O formulário envia um `POST` JSON (corpo `text/plain` para evitar preflight CORS) com: `nome`, `whatsapp` (só dígitos),
   `veiculoInteresse`, `possuiUsadoParaTroca`, `consentimentoLGPD`, `campanha`, `origem`, UTMs e `enviadoEm`.
   **Sem webhook configurado o formulário não simula envio** — avisa que o canal não está ativo.
3. `VITE_WHATSAPP_NUMBER` (opcional) habilita os botões de WhatsApp.

## Decisões técnicas
- 3D tipográfico (título, 299,99, 5.000, 300) feito em CSS com face metálica + extrusão por camadas; a luz muda com o mouse. Sem Three.js: não havia elemento 3D que justificasse o peso.
- `prefers-reduced-motion`: todas as animações GSAP ficam desativadas e o conteúdo aparece no estado final.
- Fontes self-hosted (Anton, Archivo, JetBrains Mono) via `@fontsource`.
- Datas do JSON-LD assumem 2026 (13–15/11/2026).
