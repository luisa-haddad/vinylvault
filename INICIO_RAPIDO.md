# ⚡ Início Rápido - VinylVault (SEM Docker!)

## 🎯 Setup em 10 minutos

### 1. Clone/Instale Dependências (2 min)

```bash
cd backend
npm install

cd ../mobile
npm install
```

### 2. Configure PostgreSQL na Nuvem (3 min) ⭐

Escolha UM destes (todos gratuitos):

#### 🟢 Opção A: Supabase (Recomendado)
1. Vá em https://supabase.com
2. **Sign up** → Login com GitHub
3. **New project**
4. Nome: `vinylvault`, Senha: `qualquer-senha-forte`
5. Aguarde 2 minutos
6. **Settings** → **Database** → **Connection string** → Copie a **URI**

#### ⚡ Opção B: Neon (Alternativa)
1. Vá em https://neon.tech
2. **Sign up** → Login com GitHub  
3. **Create project** → Nome: `vinylvault`
4. Copie a **Connection string**

#### 🚂 Opção C: Railway
1. Vá em https://railway.app
2. **Login with GitHub**
3. **New Project** → **Provision PostgreSQL**
4. Copie a `DATABASE_URL`

### 3. Configure o Backend (1 min)

```bash
cd backend
cp .env.example .env
```

Edite `backend/.env` e cole a connection string:

```env
# Cole a connection string aqui:
DATABASE_URL="postgresql://postgres:senha@xxx.supabase.co:5432/postgres"

JWT_SECRET="mude-este-secret-por-algo-aleatorio"
PORT=3000
```

### 4. Rode as Migrações (1 min)

```bash
npm run migrate
npm run seed
npm run dev
```

✅ **Backend rodando!** Teste: http://localhost:3000/health

### 5. Configure o Mobile (2 min)

Descubra seu IP:
```bash
# Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Ou mais simples (Mac)
ipconfig getifaddr en0
```

Edite `mobile/src/config/api.js`:

```javascript
const API_URL = 'http://SEU_IP_AQUI:3000/api'; // Ex: 192.168.1.50
```

### 6. Rode o App (1 min)

```bash
cd mobile
npm start
```

### 7. Teste no Celular

1. Instale **Expo Go** no celular
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Escaneie o QR Code** que apareceu no terminal

3. Aguarde carregar...

4. **Pronto!** 🎉

---

## ✅ Checklist

- [ ] Backend instalado
- [ ] PostgreSQL configurado (Supabase/Neon/Railway)
- [ ] `.env` configurado
- [ ] Migrações rodadas (`npm run migrate`)
- [ ] Seed rodado (`npm run seed`)
- [ ] Backend iniciado (`npm run dev`)
- [ ] IP configurado no `mobile/src/config/api.js`
- [ ] Mobile instalado
- [ ] Expo Go instalado no celular
- [ ] App rodando no celular

---

## 🎯 Primeiro Teste

1. **Crie uma conta** no app
2. Toque no botão **+** (centro)
3. Escolha **Buscar por Nome**
4. Pesquise: "Clube da Esquina"
5. Toque no **+** para adicionar
6. Volte para Home
7. **Veja seu disco na estante!** 🎵

---

## 🐛 Problemas?

### Backend não inicia
```bash
# Verifique o .env
cat backend/.env

# Teste conexão com o banco
npm run studio
```

### App não conecta
1. Backend está rodando? (http://localhost:3000/health)
2. IP está correto no `mobile/src/config/api.js`?
3. Celular e PC na **mesma rede WiFi**?
4. Teste: abra `http://SEU_IP:3000/health` no navegador do celular

### "Network request failed"
- Desative VPN
- Verifique firewall
- Confirme que está na mesma rede WiFi

---

## 📚 Próximos Passos

Tudo funcionando? Explore:

- [FEATURES.md](./FEATURES.md) - Funcionalidades
- [API.md](./API.md) - Documentação da API
- [SEM_DOCKER.md](./SEM_DOCKER.md) - Guia completo sem Docker

---

## 🆘 Ajuda

Problemas ainda? Verifique:
1. Logs do backend no terminal
2. Logs do Expo no terminal
3. [SEM_DOCKER.md](./SEM_DOCKER.md) - Troubleshooting

---

**Boa catalogação! 🎵📀**

