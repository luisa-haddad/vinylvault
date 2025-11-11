# 🚫 VinylVault sem Docker

**Guia para rodar o projeto SEM Docker/Docker Compose**

---

## 🌐 Opção 1: PostgreSQL na Nuvem (RECOMENDADO)

### ✨ Por que usar nuvem?

- ✅ **Grátis** (planos free generosos)
- ✅ **Sem instalação** local
- ✅ **Backups automáticos**
- ✅ **Fácil de usar**
- ✅ **Já está pronto para produção**

---

### 🟢 Supabase (Melhor para começar)

**Plano Free:**
- 500MB de banco
- Ilimitado de requisições
- Backups automáticos

**Setup (5 minutos):**

1. Acesse https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub
4. Clique em **"New project"**
5. Preencha:
   - **Name:** vinylvault
   - **Database Password:** (crie uma senha forte)
   - **Region:** East US (ou mais próximo)
6. Clique em **"Create new project"** (leva ~2 minutos)

7. Após criar, vá em:
   - **Settings** (⚙️ na barra lateral)
   - **Database**
   - Role até **Connection string**
   - Copie a **URI** (formato: `postgresql://postgres:...`)

8. Cole no seu `backend/.env`:
```env
DATABASE_URL="postgresql://postgres.[projeto]:[senha]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

9. Rode as migrações:
```bash
cd backend
npm run migrate
npm run seed
npm run dev
```

**Pronto!** ✅

---

### ⚡ Neon (Alternativa excelente)

**Plano Free:**
- 3GB de banco
- Serverless
- Branches (como Git!)

**Setup:**

1. Acesse https://neon.tech
2. **Sign up** com GitHub
3. Crie um projeto:
   - **Project name:** vinylvault
   - **Postgres version:** 15
   - **Region:** AWS US East
4. Copie a **Connection string**
5. Cole no `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

6. Rode as migrações:
```bash
cd backend
npm run migrate
npm run seed
npm run dev
```

---

### 🚂 Railway (Com deploy integrado)

**Plano Free:**
- $5 de crédito (renova mensalmente)
- Deploy automático do backend também!

**Setup:**

1. Acesse https://railway.app
2. **Login with GitHub**
3. **New Project**
4. **Provision PostgreSQL**
5. Clique no card do PostgreSQL
6. Vá em **Variables**
7. Copie o valor de `DATABASE_URL`
8. Cole no seu `backend/.env`

**Bônus:** Você pode fazer deploy do backend direto no Railway depois!

---

## 🍎 Opção 2: PostgreSQL Local (Homebrew)

Se preferir ter o banco localmente:

### Instalação

```bash
# 1. Instalar PostgreSQL
brew install postgresql@15

# 2. Adicionar ao PATH (adicione ao seu ~/.zshrc ou ~/.bash_profile)
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 3. Iniciar PostgreSQL
brew services start postgresql@15

# 4. Verificar se está rodando
brew services list
# Deve mostrar: postgresql@15 started
```

### Criar Database e Usuário

```bash
# Criar database
createdb vinylvault

# Criar usuário e dar permissões
psql postgres << EOF
CREATE USER vinylvault WITH PASSWORD 'vinylvault123';
ALTER USER vinylvault CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE vinylvault TO vinylvault;
\q
EOF
```

### Configurar .env

```env
DATABASE_URL="postgresql://vinylvault:vinylvault123@localhost:5432/vinylvault"
```

### Rodar Migrações

```bash
cd backend
npm run migrate
npm run seed
npm run dev
```

---

## 🔧 Comandos Úteis (Local)

### Gerenciar Serviço

```bash
# Iniciar
brew services start postgresql@15

# Parar
brew services stop postgresql@15

# Restart
brew services restart postgresql@15

# Ver status
brew services list
```

### Acessar o Banco

```bash
# Conectar ao banco
psql vinylvault

# Ou com usuário específico
psql -U vinylvault -d vinylvault
```

### Comandos SQL Úteis

```sql
-- Ver tabelas
\dt

-- Ver estrutura de uma tabela
\d users

-- Contar registros
SELECT COUNT(*) FROM vinyls;

-- Ver últimos discos
SELECT title, artist FROM vinyls ORDER BY "createdAt" DESC LIMIT 5;

-- Limpar tabela (cuidado!)
TRUNCATE TABLE vinyls CASCADE;

-- Sair
\q
```

### Backup e Restore

```bash
# Fazer backup
pg_dump vinylvault > backup.sql

# Restaurar backup
psql vinylvault < backup.sql
```

---

## 🐛 Troubleshooting

### "connection refused"

**Nuvem:**
- Verifique se a `DATABASE_URL` está correta
- Teste copiando a URL novamente do painel
- Verifique se tem `?sslmode=require` no final (Neon)

**Local:**
```bash
# Verificar se PostgreSQL está rodando
brew services list

# Se não estiver, iniciar
brew services start postgresql@15

# Ver logs de erro
tail -f /opt/homebrew/var/log/postgresql@15.log
```

### "role does not exist"

```bash
# Criar usuário novamente
psql postgres -c "CREATE USER vinylvault WITH PASSWORD 'vinylvault123';"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE vinylvault TO vinylvault;"
```

### "database does not exist"

```bash
# Criar database
createdb vinylvault

# Rodar migrações
cd backend
npm run migrate
```

### Resetar tudo (local)

```bash
# Dropar e recriar database
dropdb vinylvault
createdb vinylvault

# Rodar migrações novamente
npm run migrate
npm run seed
```

---

## 🎯 Comparação: Nuvem vs Local

| Critério | Nuvem | Local |
|----------|-------|-------|
| **Setup** | 5 min | 10-15 min |
| **Grátis** | ✅ Sim | ✅ Sim |
| **Backups** | ✅ Automático | ❌ Manual |
| **Acessível de qualquer lugar** | ✅ Sim | ❌ Não |
| **Deploy fácil** | ✅ Sim | ⚠️ Precisa migrar |
| **Performance dev** | ⚠️ Depende da internet | ✅ Rápido |
| **Privacidade** | ⚠️ Dados na nuvem | ✅ Dados locais |

---

## 💡 Recomendação

**Para este projeto, recomendo NUVEM (Supabase ou Neon)**

**Por quê?**
- ✅ Sem instalação local
- ✅ Sem Docker/Docker Compose
- ✅ Já está pronto para produção
- ✅ Backups automáticos
- ✅ Mais fácil de compartilhar (se trabalhar em equipe)
- ✅ Funciona em qualquer computador

---

## 📝 Checklist de Setup

- [ ] Escolhi o provedor (Supabase/Neon/Railway)
- [ ] Criei a conta
- [ ] Criei o projeto PostgreSQL
- [ ] Copiei a connection string
- [ ] Colei no `backend/.env`
- [ ] Rodei `npm run migrate`
- [ ] Rodei `npm run seed`
- [ ] Testei com `npm run dev`
- [ ] Backend funcionando! ✅

---

## 🆘 Precisa de Ajuda?

1. Verifique os logs: `npm run dev`
2. Teste a conexão: `npm run studio`
3. Verifique o `.env`
4. Leia o [SETUP.md](./SETUP.md)

---

**Pronto! Agora você pode rodar o VinylVault sem Docker! 🎉**

