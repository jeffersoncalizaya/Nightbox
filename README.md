# Nightbox – Loja virtual de delivery

Plataforma de vendas online que fiz como teste para lojas virtuais, usando IA no desenvolvimento. O foco é velocidade de carregamento, design responsivo e uma compra fluida para o cliente.

🔗 Site no ar: https://nighbox-delivery.vercel.app/

## Funcionalidades
- Vitrine dinâmica com navegação por categorias em carrossel
- Carrinho lateral com subtotal calculado em tempo real
- Sistema de cupons com desconto aplicado na hora
- Login e criação de conta, com validação de Gmail e recuperação de senha
- Checkout que exige login e gera Pix instantâneo (QR Code no padrão BACEN), com integração ao SDK do Mercado Pago

## Tecnologias
- TypeScript e JavaScript
- Next.js 14 (App Router) e React 18
- Tailwind CSS (tema escuro responsivo)
- API Routes do Next.js (Node.js)
- Supabase (PostgreSQL)
- Mercado Pago SDK
- Deploy na Vercel

## Como rodar localmente
1. Clone o repositório e instale as dependências: `npm install`
2. Crie um arquivo `.env.local` com as variáveis de ambiente do projeto (os nomes estão listados abaixo; os valores são secretos e não estão neste repositório)
3. Inicie o servidor de desenvolvimento: `npm run dev`

## Variáveis de ambiente
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `MERCADOPAGO_ACCESS_TOKEN`

## Contato
- E-mail: jeffersoncalizaya09@gmail.com
- Portfólio: https://portifolio-jefferson-flax.vercel.app/
