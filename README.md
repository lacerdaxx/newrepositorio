# ABC Multimarcas — Landing Page

Landing page de captação de leads para loja de veículos, com design dark (preto e vermelho), animações e formulário de contato.

## Estrutura

```
index.html            Página principal
assets/css/style.css  Estilos e animações
assets/js/script.js   Interações (menu, scroll reveal, contadores, depoimentos, FAQ, formulário)
```

## Como visualizar

Basta abrir `index.html` no navegador, ou servir a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
```

## Personalização rápida

- **Telefone/WhatsApp**: substitua `5500000000000` e `(00) 00000-0000` em `index.html` pelos dados reais da loja.
- **E-mail e endereço**: seção `<footer>` em `index.html`.
- **Veículos em destaque**: cards dentro da seção `#veiculos`.
- **Cores**: variáveis `--red`, `--black` etc. no topo de `assets/css/style.css`.
- **Envio do formulário**: o formulário (`#leadForm` em `assets/js/script.js`) hoje simula o envio no front-end. Para capturar os leads de verdade, integre com seu backend, planilha, CRM ou serviço de e-mail (ex.: EmailJS, Formspree, Zapier) no evento `submit`.
