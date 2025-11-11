# 🛠️ Comandos Úteis - VinylVault

## 📦 Backend

### Desenvolvimento
```bash
cd backend

# Instalar dependências
npm install

# Modo desenvolvimento (auto-reload)
npm run dev

# Modo produção
npm start
```

### Database (Prisma)
```bash
# Criar migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações
npm run migrate

# Resetar banco (CUIDADO: apaga tudo!)
npx prisma migrate reset

# Popular categorias
npm run seed

# Abrir Prisma Studio (GUI do banco)
npm run studio
```

### PostgreSQL Local (Homebrew)
```bash
# Iniciar PostgreSQL
brew services start postgresql@15

# Parar PostgreSQL
brew services stop postgresql@15

# Restart PostgreSQL
brew services restart postgresql@15

# Ver status
brew services list

# Conectar ao banco
psql vinylvault

# Conectar como usuário específico
psql -U vinylvault -d vinylvault
```

### Comandos PostgreSQL úteis
```sql
-- Listar tabelas
\dt

-- Ver estrutura de uma tabela
\d users

-- Contar usuários
SELECT COUNT(*) FROM users;

-- Contar discos
SELECT COUNT(*) FROM vinyls;

-- Ver últimos discos adicionados
SELECT title, artist, "createdAt" FROM vinyls ORDER BY "createdAt" DESC LIMIT 10;

-- Sair
\q
```

---

## 📱 Mobile

### Desenvolvimento
```bash
cd mobile

# Instalar dependências
npm install

# Iniciar Expo
npm start

# Limpar cache e reiniciar
npm start -- --clear

# Abrir no emulador Android
npm run android

# Abrir no simulador iOS (Mac only)
npm run ios
```

### Expo CLI
```bash
# Instalar Expo CLI global
npm install -g expo-cli

# Verificar atualizações
expo upgrade

# Build para produção
expo build:android
expo build:ios

# Ou com EAS Build (mais novo)
eas build --platform android
eas build --platform ios
```

### Debugging
```bash
# Ver logs do app
npx expo start

# Shake o device físico ou CMD+D (iOS) / CMD+M (Android) no emulador
# para abrir o menu de desenvolvedor
```

---

## 🐳 Docker

### Comandos Gerais
```bash
# Ver todos containers
docker ps -a

# Ver imagens
docker images

# Remover container
docker rm container_name

# Remover imagem
docker rmi image_name

# Limpar tudo que não está sendo usado
docker system prune -a

# Ver uso de disco
docker system df
```

### Docker Compose
```bash
# Iniciar em background
docker-compose up -d

# Iniciar e ver logs
docker-compose up

# Parar containers
docker-compose stop

# Remover containers
docker-compose down

# Rebuild e iniciar
docker-compose up -d --build

# Ver logs de um serviço
docker-compose logs postgres
docker-compose logs -f postgres  # follow logs
```

---

## 🔧 Git

### Workflow Básico
```bash
# Ver status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "mensagem"

# Push
git push origin main

# Pull
git pull origin main

# Criar branch
git checkout -b feature/nova-funcionalidade

# Ver branches
git branch

# Trocar branch
git checkout main
```

### Úteis
```bash
# Ver histórico
git log --oneline

# Desfazer último commit (mantém alterações)
git reset --soft HEAD~1

# Desfazer alterações de um arquivo
git checkout -- arquivo.js

# Ver diferenças
git diff

# Criar .gitignore global
git config --global core.excludesfile ~/.gitignore_global
```

---

## 🧪 Testing

### Backend
```bash
# Rodar testes
npm test

# Com coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## 📊 Monitoring

### Ver uso de recursos
```bash
# CPU e memória dos containers
docker stats

# Espaço em disco
df -h

# Processos Node.js
ps aux | grep node
```

### Logs
```bash
# Backend logs
tail -f logs/app.log

# Nginx logs (se usar)
tail -f /var/log/nginx/access.log
```

---

## 🚀 Deploy

### Backend (Exemplo Railway)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Mobile (Expo)
```bash
# Build Android
eas build --platform android

# Build iOS
eas build --platform ios

# Submit para stores
eas submit --platform android
eas submit --platform ios
```

---

## 🔍 Debugging

### Backend
```bash
# Node inspector
node --inspect src/server.js

# Com breakpoints
node --inspect-brk src/server.js

# Ver variáveis de ambiente
node -e "console.log(process.env)"
```

### Expo
```bash
# Verificar issues
expo doctor

# Verificar dependências
npm outdated

# Verificar vulnerabilidades
npm audit
```

---

## 📝 Úteis

### Gerar UUID
```bash
node -e "console.log(require('crypto').randomUUID())"
```

### Gerar JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Testar API
```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","password":"senha123"}'
```

### Descobrir seu IP local
```bash
# Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig | findstr IPv4

# Ou mais simples (Mac)
ipconfig getifaddr en0
```

---

## 🎯 Atalhos do VS Code

- `CMD + P` - Quick open file
- `CMD + Shift + P` - Command palette
- `CMD + B` - Toggle sidebar
- `CMD + J` - Toggle terminal
- `CMD + D` - Select next occurrence
- `CMD + /` - Toggle comment
- `Option + Up/Down` - Move line
- `Shift + Option + Up/Down` - Copy line

---

## 💡 Dicas

### Performance
```bash
# Limpar cache npm
npm cache clean --force

# Limpar cache Expo
expo start -c

# Rebuild node_modules
rm -rf node_modules && npm install
```

### Troubleshooting
```bash
# Verificar porta em uso (Mac/Linux)
lsof -i :3000

# Matar processo na porta
kill -9 $(lsof -t -i:3000)

# Verificar conectividade
ping 192.168.1.50
telnet localhost 3000
```

---

**Salve este arquivo para referência rápida!** 🚀

