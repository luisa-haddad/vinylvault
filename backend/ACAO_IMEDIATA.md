# 🚨 AÇÃO IMEDIATA: Corrigir DATABASE_URL

## ✅ Boa Notícia
O erro do Prisma OpenSSL foi resolvido! 🎉

## ❌ Problema Atual
O Railway não consegue conectar ao Supabase na porta 5432.

---

## 🎯 SOLUÇÃO RÁPIDA (2 minutos)

### Passo 1: Acesse o Railway Dashboard
https://railway.app → Seu projeto VinylVault

### Passo 2: Atualize a Variável DATABASE_URL

1. Clique em **"Variables"**
2. Encontre `DATABASE_URL`
3. Mude de:
   ```
   postgresql://postgres:SENHA@db.gzinbdpkkkqxrplpirbs.supabase.co:5432/postgres
   ```
   
   Para:
   ```
   postgresql://postgres:SENHA@db.gzinbdpkkkqxrplpirbs.supabase.co:6543/postgres?pgbouncer=true
   ```

4. **Salve** (Railway vai fazer redeploy automático)

### Mudanças:
- ❌ Porta `5432` → ✅ Porta `6543`
- ✅ Adicionar `?pgbouncer=true`

---

## 🧪 Teste (após redeploy)

```bash
curl https://SEU_APP.railway.app/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"...","service":"VinylVault API"}
```

---

## ℹ️ Por Quê?

- **Porta 5432** = Direct Connection (uso local apenas)
- **Porta 6543** = Session Pooler (otimizado para cloud/Railway)

O Session Pooler é feito para conexões externas e não tem restrições de firewall.

---

**Pronto!** Após essa mudança, seu backend vai conectar corretamente! ✅

