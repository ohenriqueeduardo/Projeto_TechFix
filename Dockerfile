# Estágio base: Instalação de dependências
FROM node:20-alpine AS base
WORKDIR /app

# Copia arquivos de definição de dependências
COPY package*.json ./

# Instala as dependências respeitando dependências legadas
RUN npm ci --legacy-peer-deps

# Estágio do Backend
FROM base AS backend
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev:server"]

# Estágio do Frontend
FROM base AS frontend
WORKDIR /app
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]

# Estágio do Drizzle Studio
FROM base AS studio
WORKDIR /app
COPY . .
EXPOSE 4983
CMD ["npx", "drizzle-kit", "studio", "--port", "4983", "--host", "0.0.0.0"]
