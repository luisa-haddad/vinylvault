# ⚡ Quick Start - VinylVault

**Começando em 5 minutos!**

## 1️⃣ Clone e Instale

```bash
# Backend
cd backend
npm install
cp .env.example .env

# Mobile
cd ../mobile
npm install
```

## 2️⃣ Configure o .env

Edite `backend/.env`:

```env
DATABASE_URL="postgresql://vinylvault:vinylvault123@localhost:5432/vinylvault"
JWT_SECRET="mude-este-secret-por-um-forte"
DISCOGS_TOKEN="opcional-por-enquanto"
```

## 3️⃣ Configure o Banco de Dados

**Opção A: Nuvem (Recomendado - Grátis!)**

Escolha um provedor:
- **Supabase**: https://supabase.com (500MB grátis)
- **Neon**: https://neon.tech (3GB grátis)
- **Railway**: https://railway.app ($5 crédito)

1. Crie uma conta
2. Crie um projeto PostgreSQL
3. Copie a **connection string**
4. Cole no `backend/.env` em `DATABASE_URL`

**Opção B: Local com Homebrew**

```bash
brew install postgresql@15
brew services start postgresql@15
createdb vinylvault
```

## 4️⃣ Rode as Migrações

```bash
cd backend
npm run migrate
npm run seed
```

## 5️⃣ Inicie o Backend

```bash
npm run dev
```

✅ Backend rodando em `http://localhost:3000`

## 6️⃣ Configure o IP do Mobile

Edite `mobile/src/config/api.js`:

```javascript
const API_URL = 'http://SEU_IP:3000/api'; // Ex: 192.168.1.50
```

Para descobrir seu IP:
- **Mac**: `ifconfig | grep "inet "`
- **Windows**: `ipconfig`
- **Linux**: `ip addr`

## 7️⃣ Inicie o App

```bash
cd mobile
npm start
```

## 8️⃣ Escaneie o QR Code

1. Instale **Expo Go** no celular ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Escaneie o QR Code que apareceu no terminal
3. Pronto! 🎉

---

## 🎯 Primeiro Uso

1. **Crie sua conta** (qualquer email funciona em dev)
2. **Adicione seu primeiro disco:**
   - Toque no botão **+** no meio da barra inferior
   - Escolha **Buscar por Nome**
   - Pesquise por "Clube da Esquina"
   - Toque no **+** para adicionar

3. **Veja sua estante** na Home!

---

## 🐛 Problemas?

### Backend não conecta ao banco:
```bash
docker ps  # Verifique se o container está rodando
docker logs vinylvault-db  # Veja os logs
```

### App não conecta no backend:
- Certifique-se de que o IP está correto
- Celular e PC devem estar na **mesma rede WiFi**
- Teste: abra `http://SEU_IP:3000/health` no navegador do celular

### Porta 3000 já em uso:
```bash
# Mude a porta em backend/.env
PORT=3001

# E em mobile/src/config/api.js
const API_URL = 'http://SEU_IP:3001/api';
```

---

## 📚 Documentação Completa

- [SETUP.md](./SETUP.md) - Guia completo de instalação
- [API.md](./API.md) - Documentação da API
- [FEATURES.md](./FEATURES.md) - Lista de funcionalidades

---

**Happy coding! 🎵✨**

