# 🚀 Guia de Instalação do VinylVault

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn**
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Expo CLI**: `npm install -g expo-cli`
- Um smartphone com o app **Expo Go** instalado ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## 🗄️ Passo 1: Configurar o Banco de Dados

### Opção A: Nuvem (Recomendado - Mais fácil!)

**Supabase** (Recomendado - 500MB grátis):

1. Acesse [supabase.com](https://supabase.com)
2. Crie um projeto
3. Copie a connection string (Settings → Database → Connection string → URI)
4. Use essa string no arquivo `.env` do backend

**Neon** (Alternativa - 3GB grátis):

1. Acesse [neon.tech](https://neon.tech)
2. Faça login com GitHub
3. Crie um projeto
4. Copie a connection string

**Railway** (Alternativa - $5 crédito):

1. Acesse [railway.app](https://railway.app)
2. New Project → Provision PostgreSQL
3. Copie a DATABASE_URL

### Opção B: Local com Homebrew (macOS)

```bash
# Instalar PostgreSQL
brew install postgresql@15

# Iniciar serviço
brew services start postgresql@15

# Criar database
createdb vinylvault

# Criar usuário
psql postgres -c "CREATE USER vinylvault WITH PASSWORD 'vinylvault123';"
psql postgres -c "ALTER USER vinylvault CREATEDB;"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE vinylvault TO vinylvault;"
```

Sua `DATABASE_URL` será:
```
DATABASE_URL="postgresql://vinylvault:vinylvault123@localhost:5432/vinylvault"
```

## 🔧 Passo 2: Configurar o Backend

```bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env
```

### Editar o arquivo `.env`:

```env
# Database (use a URL do Docker ou do Supabase)
DATABASE_URL="postgresql://vinylvault:vinylvault123@localhost:5432/vinylvault"

# JWT Secret (gere um secret forte!)
JWT_SECRET="seu-secret-super-seguro-mude-me"

# Discogs API (obtenha em https://www.discogs.com/settings/developers)
DISCOGS_TOKEN="seu-token-aqui"

# Cloudinary (opcional - para upload de imagens)
# Crie conta em https://cloudinary.com
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### Rodar as migrações do banco:

```bash
npm run migrate
```

### Fazer seed das categorias:

```bash
npm run seed
```

### Iniciar o servidor:

```bash
npm run dev
```

O backend estará rodando em `http://localhost:3000`

✅ **Teste se está funcionando**: Acesse http://localhost:3000/health no navegador

## 📱 Passo 3: Configurar o App Mobile

```bash
# Entrar na pasta mobile
cd ../mobile

# Instalar dependências
npm install
```

### Configurar a URL da API:

Edite o arquivo `mobile/src/config/api.js`:

**IMPORTANTE**: Substitua `192.168.1.100` pelo **IP da sua máquina** na rede local!

Para descobrir seu IP:
- **Mac/Linux**: `ifconfig | grep "inet "` 
- **Windows**: `ipconfig`

```javascript
const API_URL = __DEV__ 
  ? 'http://SEU_IP_AQUI:3000/api'  // Ex: 'http://192.168.1.50:3000/api'
  : 'https://sua-api-producao.com/api';
```

### Iniciar o app:

```bash
npm start
# ou
expo start
```

Isso abrirá o Expo DevTools no navegador.

### Rodar no celular:

1. Abra o **Expo Go** no seu celular
2. Escaneie o QR Code que apareceu no terminal/navegador
3. O app será carregado no seu celular!

## 🎉 Pronto!

Agora você pode:

1. **Criar uma conta** no app
2. **Adicionar discos** usando:
   - Scanner de código de barras
   - Busca por nome
   - Cadastro manual
3. **Ver sua coleção** organizada por categorias
4. **Compartilhar** via QR Code

---

## 🔑 Obtendo Token do Discogs

Para buscar discos nas bases de dados públicas:

1. Acesse [https://www.discogs.com/settings/developers](https://www.discogs.com/settings/developers)
2. Faça login ou crie uma conta
3. Gere um **Personal Access Token**
4. Cole o token no arquivo `.env` do backend

---

## 🐛 Troubleshooting

### Backend não inicia

**Se estiver usando nuvem:**
- Verifique se a `DATABASE_URL` está correta no `.env`
- Teste a conexão com `npm run studio`

**Se estiver usando local (Homebrew):**
```bash
# Verifique se PostgreSQL está rodando
brew services list

# Se não estiver, inicie:
brew services start postgresql@15

# Teste a conexão
psql vinylvault -c "SELECT 1;"
```

### App não conecta no backend

1. Certifique-se de que o backend está rodando
2. Verifique se o IP em `mobile/src/config/api.js` está correto
3. **Celular e computador devem estar na mesma rede WiFi**
4. Desative firewalls temporariamente se necessário

### Erro ao escanear código de barras

O app pede permissão para câmera. Certifique-se de aceitar!

Se não funcionar:
- iOS: Configurações → VinylVault → Permitir acesso à Câmera
- Android: Configurações → Apps → VinylVault → Permissões → Câmera

---

## 📦 Scripts Úteis

### Backend
```bash
npm run dev          # Modo desenvolvimento (hot reload)
npm start            # Modo produção
npm run migrate      # Rodar migrações
npm run seed         # Popular categorias
npm run studio       # Abrir Prisma Studio (GUI do banco)
```

### Mobile
```bash
npm start            # Iniciar Expo
npm run android      # Abrir no emulador Android
npm run ios          # Abrir no simulador iOS (Mac only)
```

---

## 🌐 Deploy em Produção

### Backend

**Opções recomendadas**:
- [Railway](https://railway.app) - Simples e barato
- [Render](https://render.com) - Free tier disponível
- [Fly.io](https://fly.io) - Ótimo para Node.js

### Mobile

Para publicar o app nas lojas:

```bash
# Build para Android (APK)
expo build:android

# Build para iOS (necessita conta Apple Developer)
expo build:ios
```

Ou use o **EAS Build** (mais moderno):

```bash
npm install -g eas-cli
eas build --platform android
```

---

## 💡 Dicas

1. **Use o Prisma Studio** para visualizar o banco: `npm run studio`
2. **Monitore os logs** do backend para ver as requisições
3. **Shake o celular** no Expo Go para abrir o menu de debug
4. **Use o Redux DevTools** ou similar para debug avançado

---

## 📞 Suporte

Problemas? Verifique:
- Logs do backend no terminal
- Logs do Expo no terminal
- Console do navegador (Expo DevTools)

---

**Desenvolvido com ❤️ para colecionadores de vinil!**

