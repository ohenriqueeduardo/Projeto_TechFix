# 🛠️ TechFix

O **TechFix** é uma plataforma SaaS que conecta clientes que precisam de suporte de TI (hardware, redes, software) a especialistas credenciados. Com uma arquitetura moderna e segura, garante pagamentos sob custódia e uma experiência premium.

---

## 🚀 Tecnologias

### Frontend
- **Core**: React 19, TypeScript, Vite.
- **Estado & Dados**: React Query.
- **Estilização**: Tailwind CSS com suporte a Dark Mode.
- **Componentes**: Radix UI, Lucide Icons, Sonner.
- **Pagamentos**: Mercado Pago.

### Backend
- **Core**: Node.js, Express (ESM), `tsx watch`.
- **Segurança**: JWT e validação de dados com Zod.
- **Comunicação**: Nodemailer (SMTP) para e-mails transacionais.
- **Integração Financeira**: Processamento e custódia via Mercado Pago.

### Banco de Dados
- **Engine**: PostgreSQL.
- **ORM**: Drizzle ORM com Drizzle Studio.

---

## ⚙️ Variáveis de Ambiente (`.env`)

Crie o arquivo `.env` na raiz do projeto com as chaves abaixo:

```env
# Banco de Dados
DATABASE_URL=postgresql://postgres:admin@localhost:5432/techfix

# Segurança / Servidor
JWT_SECRET=sua-chave-secreta
PORT=3000

# Pagamentos (Mercado Pago)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-...

# E-mail (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
```

---

## 🌐 Ambiente Online (Produção)

O projeto está hospedado e disponível em produção. Para testar e ver a plataforma em ação sem precisar baixar nada, acesse o link abaixo:

👉 **[https://projeto-tech-fix.vercel.app](https://projeto-tech-fix.vercel.app)**

---

## 🏃‍♂️ Como Executar (Ambiente Local)

1. **Instale as dependências** (use a flag `--legacy-peer-deps` devido ao React 19):
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Crie o Banco de Dados**:
   Inicie o PostgreSQL e crie o banco de dados `techfix`.

3. **Sincronize as Tabelas**:
   ```bash
   npx drizzle-kit push
   ```

4. **Inicie os Serviços**:
   O comando abaixo levanta o Frontend, a API e o Drizzle Studio simultaneamente.
   ```bash
   npm run dev:all
   ```
   - **Frontend**: http://localhost:5173
   - **Backend**: http://localhost:3000
   - **DB Studio**: https://local.drizzle.studio

---

## 🐳 Executar via Docker

Para rodar todo o ecossistema isolado em contêineres:
```bash
docker compose up --build
```

---

## 👥 Colaboradores

- **Henrique Eduardo** (Matrícula: UC24201758) — *Frontend e UI/UX*
- **Guilherme Vaz** (Matrícula: UC24100768) — *Backend*
