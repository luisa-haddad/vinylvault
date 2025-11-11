# 📝 Variáveis de Ambiente - VinylVault Backend

## Variáveis Obrigatórias

### `NODE_ENV`
**Valor**: `production`  
**Descrição**: Define o ambiente de execução

### `PORT`
**Valor**: `3000` (Railway/Render definem automaticamente)  
**Descrição**: Porta onde o servidor irá rodar

### `DATABASE_URL`
**Valor**: `postgresql://postgres:[SUA_SENHA]@db.gzinbdpkkkqxrplpirbs.supabase.co:5432/postgres`  
**Descrição**: URL de conexão com o PostgreSQL (Supabase)  
**⚠️ IMPORTANTE**: Substitua `[SUA_SENHA]` pela senha real do Supabase

### `JWT_SECRET`
**Valor**: Uma string aleatória e segura (ex: `minha_chave_super_secreta_12345678`)  
**Descrição**: Chave secreta para assinar os tokens JWT  
**💡 Dica**: Use um gerador de senhas para criar uma chave forte

### `DISCOGS_TOKEN`
**Valor**: Seu token da API do Discogs  
**Descrição**: Token de autenticação para a API do Discogs  
**Como obter**: https://www.discogs.com/settings/developers

---

## Variáveis Opcionais

### `ALLOWED_ORIGINS`
**Valor padrão**: `*`  
**Valor recomendado**: Lista de URLs separadas por vírgula  
**Exemplo**: `https://seu-app.expo.dev,https://outro-dominio.com`  
**Descrição**: URLs permitidas para fazer requisições (CORS)

### `REDIS_URL`
**Valor**: URL do Redis (se usar cache)  
**Descrição**: Conexão com Redis para cache (opcional)

### `CLOUDINARY_CLOUD_NAME`
### `CLOUDINARY_API_KEY`
### `CLOUDINARY_API_SECRET`
**Descrição**: Credenciais do Cloudinary (se usar upload de imagens)  
**Como obter**: https://cloudinary.com

---

## Exemplo Completo (Railway/Render)

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@db.gzinbdpkkkqxrplpirbs.supabase.co:5432/postgres
JWT_SECRET=minha_chave_super_secreta_12345678_abc
DISCOGS_TOKEN=seu_token_discogs_aqui
ALLOWED_ORIGINS=*
```

---

## ⚠️ Segurança

- **NUNCA** commite o arquivo `.env` no Git
- Use senhas fortes e únicas
- No Railway/Render, configure as variáveis no dashboard (elas ficam criptografadas)
- Após o deploy, teste se todas as variáveis estão configuradas corretamente

