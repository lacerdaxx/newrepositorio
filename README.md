# Outubro Black — Landing page de captação de leads

Landing page de campanha (sem estoque) para loja de seminovos. Objetivo único: transformar o visitante em lead qualificado e levá-lo ao WhatsApp da loja.

```
index.html          Página completa (HTML + CSS + JS inline, sem frameworks — carrega rápido no 4G)
api/meta-capi.js    Função serverless de exemplo para a API de Conversões da Meta (CAPI)
```

Para visualizar: abra `index.html` ou rode `python3 -m http.server 8000`.

## Placeholders para editar

Todos os valores entre colchetes `[ ]` são placeholders — busque por `[` no `index.html`:

| Placeholder | Onde |
|---|---|
| `[NOME DA LOJA]`, `[endereço]`, `[cidade/UF]`, CNPJ | título, header, rodapé, consentimento |
| `[PIXEL_ID]` | Meta Pixel no `<head>` (2 lugares) |
| `[META_DOMAIN_VERIFICATION]` | meta tag de verificação de domínio |
| `[0,99]`, `[10]`, `[12x]`, `[90 dias]`, `[X.XXX]`, `[3 meses]`, brinde | hero, fitas, cards, FAQ |
| `[+10]`, `[+3.000]`, `[100%]`, `[4,9]` | prova social (o contador animado lê o número do próprio texto) |
| `[LINK_DO_REGULAMENTO]`, `[LINK_POLITICA_DE_PRIVACIDADE]` | rodapé e consentimento |

No início do `<script>` há o objeto `CONFIG`:

- `whatsapp`: `55` + DDD + número (ex.: `5511999999999`)
- `capiEndpoint`: URL da função `api/meta-capi.js` publicada
- `leadWebhook` (opcional): URL de CRM/planilha que recebe o lead completo + UTMs
- `campaignEnd`: fim da contagem (padrão 31/10 23:59:59, horário de Brasília)

## Envio do lead

1. Gera `event_id` com `crypto.randomUUID()`.
2. `fbq('track','Lead', …, {eventID})` e `fbq('trackCustom','lead_qualificado', …, {eventID})`.
3. POST para `capiEndpoint` com o mesmo `event_id`, nome/sobrenome e telefone (`55` + 11 dígitos) em SHA-256, `_fbp`/`_fbc` e UTMs. A função envia os dois eventos à CAPI para deduplicação.
4. Tela "CADASTRO CONFIRMADO!" e redirecionamento ao `wa.me` após 450 ms com a mensagem pré-preenchida.

UTMs (`utm_source`, `utm_campaign`, `utm_content`, além de `utm_medium`, `utm_term` e `fbclid`) são capturadas na chegada e guardadas na sessão.

### Configurar a função CAPI

Publique `api/meta-capi.js` (Vercel/Netlify, Node 18+) com as variáveis `META_PIXEL_ID`, `META_ACCESS_TOKEN` e, opcionalmente, `META_TEST_EVENT_CODE`, `META_API_VERSION` e `ALLOWED_ORIGIN`.

## Animações

- Timeline de entrada da hero (wipe por máscara nos títulos, lift/settle no restante), executada uma vez e encerrada pela classe `is-entered`.
- Vídeo de fundo com véu escuro, parallax e zoom no scroll, dissolvendo no fundo preto da página.
- Scroll suave com inércia (só com mouse), barra de progresso, reveal com split de palavras, fitas marquee que aceleram com o scroll, painel amarelo que se expande, contadores, botões magnéticos e texto vazado com parallax.
- `prefers-reduced-motion`: sem animações e com o vídeo pausado; com economia de dados ativada, o vídeo também não toca.
