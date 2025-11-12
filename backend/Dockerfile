# Dockerfile otimizado para Railway + Prisma
FROM node:18-alpine

# Instalar OpenSSL e dependências necessárias
RUN apk add --no-cache \
    openssl \
    openssl-dev \
    libc6-compat

# Criar diretório de trabalho
WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Start command
CMD ["npm", "start"]
