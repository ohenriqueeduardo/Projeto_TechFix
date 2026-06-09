# 🛠️ TechFix - Plataforma de Suporte Técnico Especializado

O **TechFix** é uma solução SaaS (Software as a Service) de altíssimo nível desenvolvida para conectar clientes que necessitam de reparos de hardware, redes e suporte de TI de alta performance com técnicos e especialistas credenciados. 

A plataforma possui uma arquitetura moderna, robusta, altamente performática e segura, integrando um banco de dados relacional dinâmico, segurança criptográfica nativa, validação rigorosa de dados e uma interface visual premium com suporte a Dark Mode, Glassmorphism e transições fluidas.

---

## 🚀 Arquitetura e Stack Tecnológica

O ecossistema é dividido em uma estrutura desacoplada com total sincronismo entre o banco de dados, o servidor da API e a aplicação web:

### 💻 Frontend (Client Side)
*   **Core**: React 19, TypeScript, Vite.
*   **Estilização**: Tailwind CSS com animações fluidas e micro-interações integradas.
*   **Gerenciador de Estado**: React Query (TanStack Query) para cache e sincronização otimizada com a API.
*   **Navegação**: React Router DOM com fluxos protegidos por papel de usuário (Clientes vs. Profissionais).
*   **UI Components**: Componentes customizados baseados em Radix UI, Lucide Icons e notificações elegantes via Sonner.

### ⚙️ Backend (API Server)
*   **Core**: Servidor Express modular com módulos ESM nativos em NodeJS e carregamento instantâneo com `tsx watch`.
*   **Autenticação & Controle de Acesso (IAM)**: JSON Web Tokens (JWT) com criptografia nativa do Node (`crypto.pbkdf2Sync` + salt aleatório) para segurança inabalável. Sessões configuradas para expirar após **2 horas** de inatividade.
*   **Validação**: Validação estrita de contratos de payload no corpo/parâmetros/query das requisições via middlewares baseados em **Zod**.
*   **Tratamento de Erros**: Handler global de exceções que intercepta erros `500` e retorna respostas padronizadas em JSON (evitando o envio de páginas HTML de erro brutas para o frontend).

### 🗄️ Banco de Dados (Database Layer)
*   **Engine**: **PostgreSQL** para persistência relacional ácida e robusta.
*   **ORM**: **Drizzle ORM** (Type-safe, leve, focado em performance absoluta e autocompletação em tempo de desenvolvimento).
*   **Migrations**: Controle de alterações de esquema geradas de forma declarativa e controlada pelo Drizzle Kit.
*   **Studio**: Drizzle Studio para gerenciamento visual simplificado de tabelas e relacionamentos.

---

## 📂 Estrutura do Projeto

```text
Projeto_TechFix/
├── server/                     # Servidor Backend (Express)
│   ├── controllers/            # Controladores da regra de negócio (Auth, Orders, Reviews...)
│   ├── middleware/             # Interceptores de autenticação JWT e validação Zod
│   ├── routes/                 # Definição e roteamento das rotas REST (/api/...)
│   └── index.ts                # Inicialização e configuração do servidor Express
├── src/                        # Aplicação Frontend (React) e Camada de Acesso a Dados
│   ├── components/             # Componentes de interface e layouts (Client/Professional Layouts)
│   ├── data/                   # Arquivos de dados estáticos legados (para referência histórica)
│   ├── db/                     # Inicialização da conexão, Schema declarativo e Script de Seeds
│   ├── pages/                  # Páginas divididas por perfis (Auth, Cliente, Técnico, Admin)
│   ├── utils/                  # Utilitários de formatação de valores, datas e strings
│   ├── App.tsx                 # Roteador principal do React com redirecionamentos inteligentes
│   └── main.tsx                # Ponto de entrada da aplicação frontend
├── drizzle/                    # Histórico de arquivos SQL gerados pelo Drizzle Migrations
├── database/                   # Arquivos SQL brutos de schema e sementes de dados
├── drizzle.config.ts           # Arquivo de configuração central do Drizzle ORM
├── package.json                # Gerenciador de scripts de desenvolvimento e dependências do Node
├── TechFix_Postman_Collection.json # Coleção oficial de testes de API (Postman)
└── .env                        # Variáveis de ambiente protegidas e locais
```

---

## ⚙️ Configuração das Variáveis de Ambiente (`.env`)

Crie ou edite o arquivo **`.env`** localizado na raiz do projeto. Ele é necessário tanto para a conexão com o PostgreSQL quanto para a assinatura e validação dos tokens de segurança:

```env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/techfix
JWT_SECRET=sua-chave-secreta-de-producao-longa-e-segura
PORT=3000
```

> [!NOTE]  
> Certifique-se de preencher a URL de conexão com o seu usuário, senha e porta locais ou na nuvem correspondentes ao seu PostgreSQL ativo.

---

## 🐳 Como Executar com Docker e Docker Compose (Recomendado) 🚀

Agora o projeto está 100% conteinerizado. Você não precisa se preocupar em instalar o Node.js, PostgreSQL ou gerenciar múltiplos terminais em sua máquina.

### Pré-requisitos
- **Docker** e **Docker Compose** instalados e em execução.

### Passo 1: Configurar Variáveis de Ambiente
O Docker Compose utiliza as variáveis padrão para conteinerização de forma automática. Se desejar documentar suas chaves locais, utilize o arquivo `.env.example` como base.

### Passo 2: Iniciar o Ambiente Integrado
Para construir as imagens e iniciar os serviços (PostgreSQL, Backend, Frontend e Drizzle Studio) integrados de uma só vez, execute na raiz do projeto:

```bash
docker compose up --build
```

O contêiner do backend coordenará automaticamente os seguintes passos:
1. Aguardará o PostgreSQL estar online (`wait.ts`).
2. Sincronizará a estrutura de dados automaticamente (`drizzle-kit push`).
3. Semeia o banco com dados de testes apenas na primeira execução (`seed.ts` de forma idempotente).
4. Inicia a API REST na porta `3000`.

O contêiner do frontend iniciará a UI do React na porta `8080` com suporte a **Hot-Reloading** (qualquer alteração salva no host reflete na hora dentro do contêiner).

### Passo 3: Acessar os Serviços

| Serviço | URL | Descrição |
| :--- | :--- | :--- |
| **Frontend Web** | [http://localhost:8080](http://localhost:8080) | Interface premium com suporte a Dark Mode e rotas de Cliente/Profissional. |
| **API Server** | [http://localhost:3000](http://localhost:3000) | Endpoints e rota de Health Check da API. |
| **Drizzle Studio** | [https://local.drizzle.studio?host=127.0.0.1](https://local.drizzle.studio?host=127.0.0.1) | Interface administrativa visual do banco de dados PostgreSQL. |

> [!IMPORTANT]
> **Acesso ao Drizzle Studio:** Devido a restrições de segurança do Windows sobre conexões a endereços do tipo `0.0.0.0`, acesse sempre utilizando **`host=127.0.0.1`** ou **`host=localhost`** na URL para garantir a conexão WebSocket segura.

### Passo 4: Redefinir o Banco de Dados (Opcional)
Se desejar reiniciar o banco de dados completamente limpo e recriar os dados de teste, execute:
```bash
docker compose down -v
docker compose up --build
```

---

## 🏃‍♂️ Como Executar o Projeto Localmente (Sem Docker)

O projeto possui comandos unificados que sincronizam o banco e disparam todos os processos necessários em paralelo. Siga os passos abaixo:

### 1. Instalar as Dependências
Devido a versões legadas de dependências de componentes visuais, execute a instalação ignorando conflitos de pacotes menores:
```bash
npm install --legacy-peer-deps
```

### 2. Configurar o Banco de Dados PostgreSQL
Certifique-se de que o seu servidor PostgreSQL local (ou remoto) está rodando e crie o banco de dados `techfix`.
No terminal do seu SGBD ou ferramenta visual, rode:
```sql
CREATE DATABASE techfix;
```

### 3. Sincronizar o Esquema com o Banco de Dados
Para subir as tabelas estruturadas declaradas em `src/db/schema.ts` diretamente para o seu banco PostgreSQL sem precisar rodar migrations manuais, use:
```bash
npx drizzle-kit push
```

### 4. Popular o Banco com Dados Iniciais (Opcional - Semente)
Caso queira testar a plataforma imediatamente com dados fictícios de ordens de serviço, mensagens, revisões e transações financeiras prontas, rode o script de seed:
```bash
npx tsx src/db/seed.ts
```
> [!IMPORTANT]  
> A senha padrão gerada criptograficamente para todas as contas de teste incluídas no seed é: **`admin`**.  
> As contas pré-criadas são:
> *   **Cliente**: `sofia@example.com`
> *   **Super Admin**: `admin@techfix.com`
> *(Nota: Técnicos pré-criados foram removidos do seed para garantir uma base limpa. Novos técnicos devem ser cadastrados via plataforma).*

---

## ⚡ Rodar o Projeto com o Comando Unificado (Fast Track) 🚀

Para agilizar o desenvolvimento, criamos um comando paralelo centralizador. **Você não precisa gerenciar múltiplas abas de terminal!**

Execute na raiz do projeto:
```bash
npm run dev:all
```

**O que este comando executa em paralelo:**
1.  **Sincronização**: Realiza um push automático de possíveis novas tabelas ou colunas (`drizzle-kit push`).
2.  **API Server**: Inicia a API REST Express em `http://localhost:3000`.
3.  **Frontend**: Inicia a interface gráfica web em `http://localhost:8080`.
4.  **Drizzle Studio**: Abre o gerenciador visual e administrativo do banco de dados na porta `4983` (`https://local.drizzle.studio`).

---

## 🔒 Fluxo de Autenticação e Sistema 100% Integrado ao PostgreSQL

A plataforma agora não depende mais de "Mock Data" em Cache/LocalStorage, sendo um sistema inteiramente dinâmico e integrado ao PostgreSQL em tempo real:

*   **Cadastro Padrão em Duas Etapas**: Ao se registrar como **Cliente** ou **Técnico** na página `/cadastro`, o usuário passa por um fluxo que coleta informações essenciais (Nome, E-mail, Senha) e, em seguida, **Telefone (WhatsApp), Data de Nascimento** e um sistema de **Endereço Inteligente integrado com a API ViaCEP** (preenchimento automático ao digitar o CEP).
*   **Fluxo de "Completar Perfil" (Social Login)**: Caso o usuário opte pelo atalho de login via **Google ou Apple** e sua conta seja nova, a plataforma identifica a ausência do CEP/Telefone e redireciona o usuário compulsoriamente para uma tela de "Completar Cadastro" antes de liberar o acesso ao painel.
*   **Perfis Limpos (Blank States)**: Todo o lixo de dados simulados do desenvolvimento foi removido. Novos profissionais começam com murais de ordens vazios e sem dinheiro em caixa, populando suas plataformas apenas conforme recebem solicitações reais de clientes através do fluxo do banco de dados relacional.
*   **Listagens Reais**: As páginas de "Detalhes do Serviço" e o fluxo de "Checkout" consultam apenas profissionais ativamente cadastrados e reais no sistema via PostgreSQL, extirpando "fantasmas" mockados.

---

## 📬 Testando a API com Postman

Na pasta raiz do projeto está localizado o arquivo `TechFix_Postman_Collection.json`.
1. Abra o **Postman**.
2. Clique em **Import** e selecione o arquivo.
3. Use a coleção para testar de forma isolada os endpoints de autenticação, usuários, serviços, ordens e transações do backend Express.

---

## 🛑 Como Finalizar os Servidores de Forma Limpa

Para desligar o ambiente concorrente sem deixar portas presas ou processos Node.js zumbis em segundo plano, basta ir no terminal onde o comando `npm run dev:all` está ativo e pressionar:
```text
Ctrl + C
```
Pressione **`S`** (ou `Y` dependendo do idioma do terminal) seguido de **Enter** para finalizar o trabalho em lote. Todos os processos serão derrubados de forma organizada e limpa.
