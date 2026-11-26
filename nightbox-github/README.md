# 🌌 NIGHTBOX — E-Commerce & Delivery Web App

Aplicação web full-stack de e-commerce e delivery desenvolvida com **Next.js 14**, **React 18** e **TypeScript**, focada em alta performance, conversão de vendas e interface moderna em **Dark Mode**.

---

## 🛠️ Tecnologias & Arquitetura

- **Linguagem:** TypeScript (v5.6) & JavaScript (ES6+)
- **Framework Full-Stack:** [Next.js 14](https://nextjs.org/) (App Router & Server Components)
- **Biblioteca de Interface:** [React 18](https://react.dev/)
- **Estilização:** [Tailwind CSS v3.4](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Pagamentos:** Pix Direto (QR Code EMV BACEN) & Mercado Pago SDK
- **Banco de Dados (Opcional):** Supabase (PostgreSQL) com suporte a LocalStorage offline-first
- **Deploy:** Otimizado nativamente para [Vercel](https://vercel.com/)

---

## ✨ Principais Funcionalidades

- **Design Dark Mode Responsivo:** Experiência moderna e fluida em computadores e smartphones.
- **Navegação por Categorias em Carrossel:** Filtros dinâmicos rápidos por seções de produtos.
- **Carrinho de Compras Interativo (Drawer):** Atualização instantânea de subtotal e itens.
- **Sistema de Cupons:** Suporte a cupom de desconto com recalculo dinâmico (ex: `primeiraCompra10`).
- **Autenticação de Usuários:**
  - Abas independentes para Login e Criação de Conta.
  - Validação estrita de e-mail `@gmail.com`.
  - Fluxo de recuperação de senha ("Esqueceu sua senha?").
  - Bloqueio de finalização de pedido sem login ativo.
- **Checkout Otimizado com Pix:**
  - Geração automática de QR Code dinâmico no padrão Banco Central (EMV).
  - Código Copia e Cola instantâneo.
  - Ocultação e proteção de dados sensíveis do titular na tela de confirmação.
- **Painel Administrativo (`/admin`):**
  - Gestão de pedidos, status e produtos da loja.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18.18+ ou superior recomendada)
- Gerenciador de pacotes `npm`

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU-USUARIO/nightbox.git
cd nightbox
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar as variáveis de ambiente
Copie o arquivo de exemplo e crie o seu `.env.local`:
```bash
cp .env.example .env.local
```
Edite `.env.local` e preencha suas configurações (ex: sua chave Pix).

### 4. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação rodando!

---

## 📦 Como Fazer o Deploy na Vercel

1. Crie uma conta gratuita em [vercel.com](https://vercel.com).
2. Conecte seu repositório do GitHub e clique em **Import**.
3. Adicione suas variáveis de ambiente em **Settings > Environment Variables** (conforme `.env.example`).
4. Clique em **Deploy**!

---

## 📄 Licença
Distribuído sob a licença MIT. Consulte o arquivo `LICENSE` para obter mais informações.
