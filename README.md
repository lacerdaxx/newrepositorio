# Informática Total — Landing Page

Landing page de vendas para o curso "Curso Completo de Informática do Zero ao Avançado" (Windows, Word, Excel, PowerPoint e Internet), com design dark (preto e vermelho), animações e funil completo: barra de urgência, hero, o que você vai aprender, 7 bônus, benefícios, oferta com timer e preço, garantia, formulário e FAQ.

O conteúdo (headline, oferta, bônus, garantia e FAQ) segue o texto fornecido pelo cliente para este produto.

## Estrutura

```
index.html            Página principal
assets/css/style.css  Estilos e animações
assets/js/script.js   Interações (menu, scroll reveal, countdown, FAQ, formulário)
```

## Como visualizar

Basta abrir `index.html` no navegador, ou servir a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
```

## O que revisar antes de publicar

- **Contato**: telefone/WhatsApp (`5500000000000`), e-mail (`contato@informaticatotal.com.br`) e links de redes sociais no header/footer — hoje são placeholders.
- **Termos de Uso / Política de Privacidade**: links `#` no footer — aponte para as páginas reais.
- **Checkout**: o formulário em `#garantir-vaga` hoje apenas simula o envio no front-end. Integre com sua plataforma de pagamento (Hotmart, Kiwify, Eduzz etc.) no evento `submit` de `#leadForm` em `assets/js/script.js`, ou troque o botão de oferta por um link direto de checkout.
- **Prazo da garantia**: 7 dias, conforme informado — ajuste se sua plataforma usar outro padrão.

## Personalização rápida

- **Cores**: variáveis `--red`, `--black` etc. no topo de `assets/css/style.css`.
- **Countdown**: timer evergreen de 24h por visitante (`assets/js/script.js`, `STORAGE_KEY`/`WINDOW_MS`). Troque por uma data fixa se preferir uma campanha com prazo real.
- **Imagem do produto**: o mockup do hero (laptop com logo do Windows + ícones do Word/Excel/PowerPoint flutuando) é feito em HTML/CSS puro, inspirado na arte de referência enviada. Para usar uma imagem real do produto, substitua o bloco `.office-stage` em `index.html` por uma `<img>`.
