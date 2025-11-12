# 🔧 Corrigir Erro de Conexão com Supabase

## ❌ Erro Atual
```
PrismaClientInitializationError: Can't reach database server at 
`db.gzinbdpkkkqxrplpirbs.supabase.co:5432`
```

## 🎯 Causa
A porta **5432** (Direct Connection) do Supabase tem restrições de firewall e não é otimizada para conexões externas de serviços cloud como Railway.

## ✅ Solução: Use o Session Pooler (Porta 6543)

### No Railway Dashboard

1. Vá em **Variables**
2. Encontre a variável `DATABASE_URL`
3. Atualize para:

```
postgresql://postgres:SUA_SENHA@db.gzinbdpkkkqxrplpirbs.supabase.co:6543/postgres?pgbouncer=true
```

**Mudanças:**
- ❌ Porta `5432` → ✅ Porta `6543`
- ✅ Adicionar `?pgbouncer=true` no final

4. Clique em **"Redeploy"** para aplicar

### Diferenças entre as Portas

| Porta | Tipo | Quando Usar |
|-------|------|-------------|
| **5432** | Direct Connection | ❌ NÃO usar no Railway/cloud |
| **6543** | Session Pooler | ✅ Ideal para Railway/cloud |

### Por que usar Session Pooler?

- ✅ Otimizado para conexões externas
- ✅ Gerencia conexões automaticamente
- ✅ Melhor performance em ambientes serverless
- ✅ Sem restrições de firewall

---

## 🧪 Como Pegar a URL Correta no Supabase

1. Acesse seu projeto no Supabase
2. Vá em **Settings** → **Database**
3. Role até **Connection String**
4. Escolha a aba **"Session mode"** (não "Transaction mode")
5. Copie a string de conexão
6. Cole no Railway como variável `DATABASE_URL`

---

## 📝 Exemplo de Variáveis no Railway

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:sua_senha_aqui@db.gzinbdpkkkqxrplpirbs.supabase.co:6543/postgres?pgbouncer=true
JWT_SECRET=sua_chave_jwt_secreta
DISCOGS_TOKEN=seu_token_discogs
ALLOWED_ORIGINS=*
```

---

## 🧪 Teste Após Atualizar

Após o redeploy, teste:

```bash
curl https://SEU_APP.railway.app/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"...","service":"VinylVault API"}
```

Se retornar isso, sua API está conectada ao banco! ✅

---

## ⚠️ Nota Importante

**NUNCA** use a porta 6543 localmente! 

- 🏠 **Local**: use porta **5432** (Direct Connection)
- ☁️ **Railway/Cloud**: use porta **6543** (Session Pooler)

Por isso, você pode ter duas variáveis `.env` diferentes:
- `.env` (local) - porta 5432
- Railway Variables (cloud) - porta 6543

