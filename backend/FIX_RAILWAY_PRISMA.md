# 🔧 Corrigir Erro Prisma no Railway

## Problema
```
prisma:warn Prisma failed to detect the libssl/openssl version
❌ Error loading shared library libssl.so.1.1: No such file or directory
```

## ✅ Solução Aplicada

### 1. Binary Targets Configurados
O `prisma/schema.prisma` agora inclui:
```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x", "linux-musl-openssl-3.0.x"]
}
```

### 2. Scripts de Build Atualizados
O `package.json` agora tem:
```json
{
  "scripts": {
    "build": "npx prisma generate && npx prisma migrate deploy",
    "postinstall": "npx prisma generate"
  }
}
```

---

## 🚀 Como Aplicar no Railway

### Opção 1: Commit e Redeploy (Recomendado)

```bash
# 1. Commit as alterações
git add .
git commit -m "fix: prisma binary targets para railway"
git push origin main

# 2. Railway vai fazer redeploy automaticamente
# Aguarde e teste: curl https://SEU_APP.railway.app/health
```

### Opção 2: Configuração Manual no Railway

Se ainda der erro:

1. **Vá no Railway Dashboard**
2. **Clique no seu projeto**
3. **Settings → Deploy**
4. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. **Clique em Deploy** novamente

### Opção 3: Adicionar Variável de Ambiente

No Railway, adicione:
```
PRISMA_CLI_BINARY_TARGETS=debian-openssl-3.0.x,linux-musl-openssl-3.0.x
```

---

## 🧪 Testar

Após o deploy, teste:

```bash
curl https://SEU_APP.railway.app/health
```

Se retornar `{"status":"ok",...}`, está funcionando! ✅

---

## 📚 Mais Informações

- [Prisma Binary Targets](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#binarytargets-options)
- [Railway + Prisma](https://docs.railway.app/databases/postgresql#using-prisma)

