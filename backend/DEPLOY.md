# 🚀 Deploy do Backend VinylVault

## Opção 1: Railway (Recomendado) ✅

### Pré-requisitos

- Conta no GitHub
- Conta no Railway (https://railway.app)
- Banco de dados Supabase já configurado

### Passo a Passo

#### 1. Prepare o Repositório

```bash
# Se ainda não tem git inicializado
cd /Users/luhaddad/Documents/VinylVault
git init
git add .
git commit -m "feat: backend vinylvault pronto para deploy"

# Crie um repositório no GitHub e suba o código
git remote add origin https://github.com/SEU_USUARIO/vinylvault.git
git branch -M main
git push -u origin main
```

#### 2. Deploy no Railway

1. Acesse https://railway.app e faça login com GitHub
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha o repositório **vinylvault**
5. Railway vai detectar automaticamente o Node.js

#### 3. Configure as Variáveis de Ambiente

No Railway, vá em **"Variables"** e adicione:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:[SUA_SENHA]@db.gzinbdpkkkqxrplpirbs.supabase.co:5432/postgres
JWT_SECRET=sua_chave_secreta_super_segura_aqui
DISCOGS_TOKEN=seu_token_discogs_aqui
ALLOWED_ORIGINS=*
```

#### 4. Configure o Build

Railway detecta automaticamente, mas certifique-se:

- **Build Command**: (deixe vazio, o `postinstall` já gera o Prisma Client)
- **Start Command**: `npm start`
- **Root Directory**: `backend` (se o Railway não detectar automaticamente)

#### 5. Execute as Migrations

Após o primeiro deploy, vá em **Railway > Settings > Deploy Trigger** e adicione um comando:

Ou execute manualmente via Railway CLI:

```bash
railway run npm run migrate:prod
```

Ou execute as migrations diretamente no Supabase SQL Editor (como fizemos antes).

#### 6. Pronto! 🎉

Seu backend estará rodando em uma URL como:

```
https://vinylvault-backend-production.up.railway.app
```

Copie essa URL e atualize o `mobile/src/config/api.js`:

```javascript
const API_URL = "https://SEU_APP.up.railway.app/api";
```

---

## Opção 2: Render

### Passo a Passo

1. Acesse https://render.com e faça login com GitHub
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure:

   - **Name**: vinylvault-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

5. Adicione as variáveis de ambiente (mesmas do Railway)

6. Clique em **"Create Web Service"**

7. Execute as migrations no Supabase SQL Editor

---

## Opção 3: Vercel (Para APIs Node.js)

### Configuração

1. Instale a CLI:

```bash
npm i -g vercel
```

2. Na pasta `backend`, crie `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

3. Deploy:

```bash
cd backend
vercel --prod
```

4. Configure as variáveis de ambiente no dashboard da Vercel

---

## Problemas Comuns

### Prisma não encontra o schema

**Solução**: Certifique-se que o `postinstall` script está no `package.json`:

```json
"postinstall": "npx prisma generate"
```

### Erro de conexão com banco

**Solução**: Verifique se a `DATABASE_URL` está correta e se o Supabase permite conexões externas

### Port já em uso

**Solução**: Railway/Render definem a variável `PORT` automaticamente. Use:

```javascript
const PORT = process.env.PORT || 3000;
```

---

## Testando o Deploy

Após o deploy, teste os endpoints:

```bash
# Health check
curl https://SEU_APP.railway.app/api/health

# Criar usuário
curl -X POST https://SEU_APP.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

---

## Próximos Passos

1. ✅ Deploy do backend no Railway
2. 📱 Atualizar URL no mobile app
3. 🚀 Deploy do mobile app (Expo)
