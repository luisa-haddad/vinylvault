const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Testar conexão
prisma.$connect()
  .then(() => {
    console.log('✅ Conectado ao PostgreSQL');
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar ao PostgreSQL:', error);
    process.exit(1);
  });

module.exports = prisma;

