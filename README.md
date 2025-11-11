# 🎵 VinylVault

**Seu catálogo digital de discos de vinil!**

## 📋 Sobre o Projeto

VinylVault é um aplicativo mobile para catalogar e gerenciar sua coleção de discos de vinil. Com integração às bases públicas Discogs e MusicBrainz, você pode adicionar discos facilmente através de busca por barcode, nome ou cadastro manual.

## ✨ Funcionalidades

### 🔐 Autenticação
- Sistema completo de login e registro
- JWT para sessões seguras

### 📚 Gerenciamento de Acervo
- **Adicionar discos via:**
  - Scanner de código de barras
  - Busca por nome do disco
  - Cadastro manual completo
- **Organização por categorias** (MPB, Rock, Jazz, etc.)
- **Layout visual tipo estante**
- Upload de capas personalizadas

### 🌐 Compartilhamento
- **QR Code único** para sua coleção
- Visualização pública com filtros
- Busca por artista ou nome do disco

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** + **Express**
- **PostgreSQL** (barato e poderoso)
- **Prisma** (ORM moderno)
- **JWT** para autenticação
- **Cloudinary** para armazenamento de imagens (free tier)

### Frontend
- **React Native** com Expo
- **React Navigation** para rotas
- **React Native Vision Camera** para barcode
- **Axios** para API
- **AsyncStorage** para cache local

### APIs Externas
- **Discogs API** - Catálogo de discos
- **MusicBrainz API** - Metadados musicais
- **QRCode Generator** - Compartilhamento

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- PostgreSQL (Nuvem recomendado: Supabase ou Neon)

### Backend

```bash
cd backend
npm install
cp .env.example .env

# Configure o DATABASE_URL no .env com:
# - Supabase: https://supabase.com (Grátis)
# - Neon: https://neon.tech (Grátis)
# - Railway: https://railway.app (Grátis)
# Veja SEM_DOCKER.md para detalhes

# Rodar migrações
npm run migrate

# Popular categorias
npm run seed

# Iniciar servidor
npm run dev
```

### Frontend

```bash
cd mobile
npm install

# Iniciar app
npm start
# ou
expo start
```

## 📁 Estrutura do Projeto

```
VinylVault/
├── backend/              # API Node.js + Express
│   ├── src/
│   │   ├── config/      # Configurações
│   │   ├── controllers/ # Controladores
│   │   ├── middleware/  # Middlewares (auth, etc)
│   │   ├── models/      # Modelos Prisma
│   │   ├── routes/      # Rotas da API
│   │   ├── services/    # Lógica de negócio
│   │   └── utils/       # Utilitários
│   └── prisma/          # Schema e migrações
│
├── mobile/              # App React Native
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── screens/     # Telas do app
│   │   ├── navigation/  # Navegação
│   │   ├── services/    # Chamadas à API
│   │   ├── context/     # Context API (auth, etc)
│   │   └── assets/      # Imagens e recursos
│   └── App.js
│
└── docker-compose.yml   # PostgreSQL local
```

## 🗄️ Banco de Dados

### ⭐ Recomendado: PostgreSQL na Nuvem (GRÁTIS)

Não precisa de Docker! Use um destes provedores:

1. **Supabase** - 500MB grátis + backups automáticos (🏆 recomendado!)
2. **Neon** - 3GB grátis + serverless
3. **Railway** - $5 crédito mensal

📖 **Guia completo:** [SEM_DOCKER.md](./SEM_DOCKER.md)

### Alternativa: PostgreSQL Local

```bash
brew install postgresql@15
brew services start postgresql@15
createdb vinylvault
```

## 🔑 Variáveis de Ambiente

### Backend (.env)
```
# Use a connection string do Supabase/Neon/Railway
DATABASE_URL="postgresql://postgres:senha@host.supabase.co:5432/postgres"

JWT_SECRET="seu-secret-forte-aqui"
DISCOGS_TOKEN="seu-token-discogs"
PORT=3000

# Opcional
CLOUDINARY_URL="sua-url-cloudinary"
```

## 📱 Telas do App

1. **Login/Registro**
2. **Home** - Estante de discos por categoria
3. **Adicionar Disco**
   - Scanner de barcode
   - Busca por nome
   - Cadastro manual
4. **Detalhes do Disco**
5. **Minha Coleção** - Visualização completa
6. **QR Code** - Compartilhar coleção
7. **Visualização Pública** - Acesso via QR

## 📝 TODO

- [ ] Adicionar modo escuro
- [ ] Estatísticas da coleção
- [ ] Export/Import de dados
- [ ] Empréstimo de discos (controle)
- [ ] Wishlist de discos desejados

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido com ❤️ para amantes de vinil

