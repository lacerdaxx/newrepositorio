# Acelerador 6D — Landing Page

Landing page de vendas para um produto digital ("acelerador de negócio digital"), com design dark (preto, dourado e verde), animações e funil completo: hero, dores, método, currículo, prova social, oferta com timer, garantia e formulário.

## Estrutura

```
index.html            Página principal
assets/css/style.css  Estilos e animações
assets/js/script.js   Interações (menu, scroll reveal, contadores, countdown, accordions, formulário)
```

## Como visualizar

Basta abrir `index.html` no navegador, ou servir a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
```

## Conteúdo é placeholder — o que revisar antes de publicar

Este template foi construído **sem acesso à página de origem informada** (o domínio estava bloqueado neste ambiente). Todo o texto — nome do produto, preços, bônus, módulos, depoimentos e estatísticas — é ilustrativo e precisa ser substituído pelo conteúdo real antes de publicar:

- **Nome/marca**: `Acelerador 6D` em todo o `index.html` (logo, título, `<meta>`).
- **Oferta e preços**: seção `#oferta` — valores, parcelamento, bônus e stack de valor.
- **Módulos/currículo**: seção `#modulos`.
- **Depoimentos**: seção `#resultados` — atualmente fictícios, marcados como ilustrativos no próprio texto da página. Substitua por depoimentos reais e autorizados antes de publicar.
- **Estatísticas** (`data-counter`): número de alunos, países, satisfação no hero.
- **Garantia/condições legais**: prazo de garantia, termos de uso e política de privacidade (links `#` no footer).
- **Checkout**: o formulário em `#garantir-vaga` hoje apenas simula o envio no front-end. Integre com sua plataforma de pagamento (Hotmart, Kiwify, Eduzz etc.) ou com seu CRM/e-mail no evento `submit` de `#leadForm` em `assets/js/script.js`.
- **Disclaimer**: mantenha um aviso de que resultados financeiros não são garantidos (já incluído no rodapé) — recomendado para este tipo de oferta.

## Personalização rápida

- **Cores**: variáveis `--gold`, `--green`, `--black` etc. no topo de `assets/css/style.css`.
- **Countdown**: timer evergreen de 24h por visitante (`assets/js/script.js`, `STORAGE_KEY`/`WINDOW_MS`). Troque por uma data fixa se preferir uma campanha com prazo real.
- **Imagem do produto**: o mockup do hero é feito em HTML/CSS (laptop + celular simulando um dashboard). Para usar uma foto/mockup real do produto, substitua o bloco `.device-stage` em `index.html` por uma `<img>` real.
