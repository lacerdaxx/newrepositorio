# Informática Total — Landing Page

Landing page de vendas para o curso "Curso Completo de Informática do Zero ao Avançado" (Windows, Word, Excel, PowerPoint e Internet), com design dark (preto e vermelho) e um funil enxuto e direto: barra de urgência, hero, o que você vai aprender, bônus (lista compacta), oferta com timer/preço/garantia e FAQ.

O conteúdo (headline, oferta, bônus, garantia e FAQ) segue o texto fornecido pelo cliente para este produto.

## Estrutura

```
index.html            Página principal
assets/css/style.css  Estilos e animações
assets/js/script.js   Interações (menu, scroll reveal, countdown, FAQ)
```

## Como visualizar

Basta abrir `index.html` no navegador, ou servir a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
```

## O que revisar antes de publicar

- **Contato**: telefone/WhatsApp (`5500000000000`), e-mail (`contato@informaticatotal.com.br`) e links de redes sociais no header/footer — hoje são placeholders.
- **Termos de Uso / Política de Privacidade**: links `#` no footer — aponte para as páginas reais.
- **Checkout**: o botão do `.pricing-card` (a única oferta da página) é um link direto — troque o `href="#checkout"` pelo link real da sua plataforma de pagamento (Hotmart, Kiwify, Eduzz etc.).
- **Prazo da garantia**: 7 dias, conforme informado — ajuste se sua plataforma usar outro padrão.

## Personalização rápida

- **Cores**: variáveis `--red`, `--green`, `--black` etc. no topo de `assets/css/style.css`. O valor da oferta (`R$ 19,90`) usa `--green` propositalmente para destacar do restante do tema vermelho.
- **Countdown**: timer evergreen de **15 minutos** por visitante (`assets/js/script.js`, `STORAGE_KEY`/`WINDOW_MS`) — reinicia sozinho quando chega a zero, e fica com estilo "urgente" (pulsando) no último minuto. Ajuste `WINDOW_MS` para mudar a duração, ou troque por uma data fixa se preferir uma campanha com prazo real.
- **Pop-up de prova social**: canto inferior esquerdo, alterna entre "garantiu a vaga" (nomes/cidades fictícios) e "X pessoas vendo agora" (`assets/js/script.js`, array `purchases` e função `buildEntry`). **São exemplos ilustrativos, não dados reais** — se você tiver um webhook de vendas real (Hotmart/Kiwify/Eduzz), o ideal é substituir por notificações baseadas em compras de verdade.
- **Fundo do hero**: `.office-ambient` em `assets/css/style.css` é um fundo desfocado feito em CSS (gradientes + `blur`) sugerindo um ambiente de escritório/tecnologia. Se você tiver uma foto real de escritório, me envie (ou coloque em `assets/img/`) que eu troco pelo mesmo tratamento usado na foto do produto (3D + blur).
- **Imagem do produto**: `assets/img/produto-informatica-3d.webp` é a arte enviada pelo cliente, exibida no hero (`.product-photo`) com leve inclinação 3D (`perspective`/`rotateY`/`rotateX`) e animação de flutuação (`@keyframes productFloat`). Para trocar a imagem, basta substituir esse arquivo (mantendo o nome) ou apontar o `src` da `<img class="product-photo">` para outro arquivo.
