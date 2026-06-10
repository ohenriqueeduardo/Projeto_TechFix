# 🛠️ TechFix - Plataforma de Suporte Técnico Especializado

O **TechFix** é uma solução SaaS (Software as a Service) de altíssimo nível desenvolvida para conectar clientes que necessitam de reparos de hardware, redes e suporte de TI de alta performance com técnicos e especialistas credenciados. 

A plataforma possui uma arquitetura moderna, robusta, altamente performática e segura, integrando um banco de dados relacional dinâmico, segurança criptográfica nativa, validação rigorosa de dados, envio de e-mails em tempo real, pagamentos com custódia via Stripe e uma interface visual premium com suporte a Dark Mode, Glassmorphism e transições fluidas.

---

## 🚀 Arquitetura e Stack Tecnológica

O ecossistema é dividido em uma estrutura desacoplada com total sincronismo entre o banco de dados, o servidor da API e a aplicação web:

### 💻 Frontend (Client Side)
*   **Core**: React 19, TypeScript, Vite.
*   **Estilização**: Tailwind CSS com animações fluidas e micro-interações integradas.
*   **Gerenciador de Estado**: React Query (TanStack Query) para cache e sincronização otimizada com a API.
*   **Navegação**: React Router DOM com fluxos protegidos por papel de usuário (Clientes vs. Profissionais).
*   **Integrações**: `@stripe/react-stripe-js` para fluxo seguro de checkout transparente.
*   **UI Components**: Componentes customizados baseados em Radix UI, Lucide Icons e notificações elegantes via Sonner.

### ⚙️ Backend (API Server)
*   **Core**: Servidor Express modular com módulos ESM nativos em NodeJS e carregamento instantâneo com `tsx watch`.
*   **Autenticação & Controle de Acesso (IAM)**: JSON Web Tokens (JWT) com criptografia nativa do Node para segurança inabalável. 
*   **Serviço de E-mail**: Disparo automático de e-mails transacionais (boas-vindas, etc.) integrando SMTP real via `nodemailer`.
*   **Pagamentos & Custódia (Escrow)**: Integração profunda com a API do **Stripe**. Retenção de pagamentos até a conclusão do serviço e liberação em 1-clique (Wallet Management interno).
*   **Validação**: Validação estrita de contratos de payload via middlewares baseados em **Zod**.
*   **Tratamento de Erros**: Handler global de exceções JSON.

### 🗄️ Banco de Dados (Database Layer)
*   **Engine**: **PostgreSQL** para persistência relacional ácida e robusta.
*   **ORM**: **Drizzle ORM** (Type-safe, leve e focado em performance).
*   **Migrations**: Controle declarativo via Drizzle Kit.
*   **Studio**: Drizzle Studio para gerenciamento visual simplificado de tabelas.

---

## 📂 Estrutura do Projeto

```text
Projeto_TechFix/
├── server/                     # Servidor Backend (Express)
│   ├── controllers/            # Controladores (Auth, Orders, Payments...)
│   ├── middleware/             # Interceptores (JWT, Zod)
│   ├── routes/                 # Roteamento REST (/api/...)
│   ├── utils/                  # Utilitários (Ex: disparador de email SMTP)
│   └── index.ts                # Inicialização do Express
├── src/                        # Aplicação Frontend (React)
│   ├── components/             # Componentes de interface compartilhados
│   ├── db/                     # Esquema declarativo (Drizzle) e seeds
│   ├── pages/                  # Páginas divididas por perfis
│   ├── utils/                  # Utilitários de frontend
│   ├── App.tsx                 # Roteador principal
│   └── main.tsx                # Entry-point do React
├── drizzle/                    # Histórico de Migrations SQL
├── database/                   # Arquivos SQL brutos e seeds
├── package.json                # Dependências e scripts
└── vite.config.ts              # Configuração do Vite (porta 5173)
```

---

## ⚙️ Configuração das Variáveis de Ambiente (`.env`)

Crie ou edite o arquivo **`.env`** localizado na raiz do projeto preenchendo as seguintes chaves essenciais:

```env
# Banco de Dados
DATABASE_URL=postgresql://postgres:admin@localhost:5432/techfix

# Segurança / Autenticação
JWT_SECRET=sua-chave-secreta-de-producao-longa-e-segura
PORT=3000

# Integração de Pagamentos (Stripe)
STRIPE_SECRET_KEY=sk_test_... # Sua chave privada do Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_... # Sua chave pública do Stripe (exposta para o Vite)

# Configuração de E-mail SMTP (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
```

---

## 🏃‍♂️ Como Executar o Projeto Passo a Passo (Ambiente Local)

Siga estas instruções para levantar a plataforma em sua máquina de forma simples e direta:

### 1. Instalar as Dependências
Devido a atualizações recentes e ao uso de bibliotecas completas (como Radix UI e Next Themes), instale as dependências usando a flag `--legacy-peer-deps` para evitar conflitos de versão do React 19:
```bash
npm install --legacy-peer-deps
```

### 2. Preparar o Banco de Dados
Certifique-se de ter um serviço do **PostgreSQL** rodando (local ou nuvem). Crie um banco chamado `techfix`.
No terminal do seu SGBD ou ferramenta visual, rode:
```sql
CREATE DATABASE techfix;
```
Preencha a URL de conexão na variável `DATABASE_URL` do seu `.env`.

### 3. Sincronizar as Tabelas (Drizzle Push)
Para que o banco de dados receba toda a estrutura de tabelas criada pela aplicação (Usuários, Pedidos, Transações financeiras, etc), rode:
```bash
npx drizzle-kit push
```

### 4. Rodar o Ambiente (Comando Unificado) 🚀
Com o banco preparado e as variáveis configuradas, você pode levantar todos os serviços de uma única vez. Na raiz do projeto execute:
```bash
npm run dev:all
```

**O que este comando inicia:**
1. **Frontend Web (Vite)**: Ficará disponível em [http://localhost:5173](http://localhost:5173).
2. **API Backend (Express)**: Inicia as rotas na porta `3000` (`http://localhost:3000`).
3. **Drizzle Studio**: Abre uma interface local para ver seu banco de dados em `https://local.drizzle.studio`.

> Para parar todos os processos, basta dar um `Ctrl + C` no terminal em que o comando está rodando.

---

## 💎 Principais Funcionalidades Implementadas

### 🔒 Sistema de Custódia de Pagamentos (Escrow)
A TechFix possui um sistema real de segurança para o cliente e profissional.
- O cliente paga pelo serviço utilizando o cartão de crédito através do checkout transparente do **Stripe**.
- O dinheiro fica retido na TechFix. O profissional visualiza o ganho no painel financeiro como **"Saldo Bloqueado/Em Custódia"**.
- Ao término do conserto e aprovação, o cliente clica em "Serviço Concluído" e o valor é instantaneamente liberado como **"Saldo Disponível"** na carteira virtual do técnico.

### 📧 Comunicação por E-mail (SMTP)
Com a biblioteca `nodemailer`, a plataforma envia um e-mail em HTML padronizado para o endereço do cliente assim que ele finalizar o cadastro (ou entrar pela primeira vez através de login social). Todo disparo de email é configurável através de credenciais SMTP reais (.env).

### 👥 Perfis Integrados ao PostgreSQL
Chega de dados fakes em LocalStorage. A plataforma alimenta os "Dashboards", painéis de controle, fluxos de checkout e relatórios financeiros 100% diretamente com os registros ACID do banco de dados relacional.

---

## 🐳 Alternativa: Executar com Docker
Se preferir, o ecossistema completo conta com um `docker-compose.yml`. Após preencher as variáveis (.env), rode:
```bash
docker compose up --build
```
Isso provisionará o Node.js, Banco de Dados, Vite e a API isolados em contêineres e na rede interna do Docker automaticamente.

---

*Projeto desenvolvido para revolucionar o suporte em TI através da tecnologia e confiança mútua!* 🚀
