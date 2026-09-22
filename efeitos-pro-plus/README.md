# Efeitos PRO+ — Landing Page

Landing page de alta conversão para o produto digital **Efeitos PRO+**, um pack
de efeitos profissionais para edição de vídeos no CapCut. Feita com React +
TypeScript + Tailwind CSS, com estética dark/premium, glassmorphism discreto,
glow dourado e microanimações de scroll reveal.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- lucide-react (ícones)

## Estrutura

```
src/
  components/        Um componente por seção (Navbar, Hero, ProblemSection, ...)
  components/ui/      Reveal (scroll reveal) e BeforeAfterSlider (slider antes/depois)
  hooks/useScrollReveal.ts   Hook de IntersectionObserver usado pelo Reveal
  config.ts           PURCHASE_URL e preço da oferta
  index.css           Tokens de tema, utilitários e animações Tailwind
```

## Como rodar

```bash
cd efeitos-pro-plus
npm install
npm run dev       # ambiente de desenvolvimento
npm run build     # build de produção (roda typecheck + vite build)
npm run preview   # serve o build de produção localmente
```

## Antes de publicar

1. **Link de checkout** — troque `PURCHASE_URL` em `src/config.ts`. Todos os
   CTAs da página apontam para essa única variável.
2. **Preço** — ajuste `PRICE` em `src/config.ts` caso o valor promocional mude.
3. **Bônus** (`src/components/Bonuses.tsx`) — edite ou remova os cards
   `BÔNUS #01/02/03` conforme a oferta real.
4. **Depoimentos** (`src/components/Testimonials.tsx`) — substitua os
   placeholders `"Adicione aqui um depoimento real de cliente."` por
   depoimentos reais. Não foram inventados nomes nem avaliações.
5. **FAQ** (`src/components/FAQ.tsx`) — as respostas sobre entrega, prazo de
   acesso e licença de uso estão marcadas como `[Edite esta resposta...]` e
   devem refletir a plataforma de entrega e os termos reais do produto.
6. **Antes/Depois** (`src/components/ui/BeforeAfterSlider.tsx`) — o slider usa
   placeholders estilizados (sem vídeos reais). Substitua pelos vídeos reais
   quando disponíveis.
7. **Demonstração** (`src/components/Demo.tsx`) — o player central é um
   placeholder pronto para receber um vídeo real (troque o `<button>` por um
   `<video>` ou embed).
8. **OG image** — adicione uma imagem em `public/og-image.png` para o
   compartilhamento em redes sociais (referenciada em `index.html`).

## Importante

Nenhum depoimento, número de compradores, contador de escassez ou garantia
foi inventado — todos esses pontos estão marcados como placeholders
editáveis, conforme solicitado.
