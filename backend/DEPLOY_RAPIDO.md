# 🚀 Deploy Rápido - Railway

## Passo 1: Prepare o Git

```bash
cd /Users/luhaddad/Documents/VinylVault

# Se ainda não tem git
git init

# Adicione tudo
git add .
git commit -m "feat: backend pronto para deploy"

# Crie um repositório no GitHub e suba
# Vá em https://github.com/new
# Depois:
git remote add origin https://github.com/SEU_USUARIO/vinylvault.git
git branch -M main
git push -u origin main
```

## Passo 2: Deploy no Railway

1. Acesse: https://railway.app
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Escolha **"Deploy from GitHub repo"**
5. Selecione o repositório **vinylvault**
6. Railway vai detectar o **Dockerfile** e usar ele automaticamente
7. Deploy vai iniciar automaticamente

## Passo 3: Configure as Variáveis

Na página do projeto no Railway:

1. Clique na aba **"Variables"**
2. Clique em **"New Variable"** e adicione:

```
NODE_ENV = production
DATABASE_URL = postgresql://postgres:SUA_SENHA@db.gzinbdpkkkqxrplpirbs.supabase.co:5432/postgres
JWT_SECRET = sua_chave_secreta_aqui
DISCOGS_TOKEN = seu_token_discogs
ALLOWED_ORIGINS = *
```

3. Clique em **"Deploy"** para aplicar

## Passo 4: Teste

Após o deploy, Railway vai te dar uma URL como:
```
https://vinylvault-backend-production.up.railway.app
```

Teste:
```bash
curl https://SEU_APP.railway.app/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"...","service":"VinylVault API"}
```

## Passo 5: Atualize o Mobile

Edite `mobile/src/config/api.js`:

```javascript
const API_URL = 'https://SEU_APP.railway.app/api';
```

---

## ⚠️ Problemas Comuns

### Erro: "libssl.so.1.1: No such file or directory"

**Solução**: Já configuramos o `Dockerfile` que instala o OpenSSL automaticamente.

O Railway vai usar o Dockerfile e tudo funcionará! ✅

### Railway não detectou o Dockerfile?

Se o Railway não usar o Dockerfile automaticamente:

1. Vá em **Settings** → **Deploy**
2. Certifique-se que **"Dockerfile Path"** está: `backend/Dockerfile`
3. Force um novo deploy

---

## ✅ Pronto!

Seu backend está no ar 24/7! 🎉

**Próximo passo**: Deploy do mobile app com Expo

