const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar categorias padrão
  const categories = [
    { name: 'MPB', slug: 'mpb', icon: '🎵', color: '#FFB800', order: 1 },
    { name: 'Rock', slug: 'rock', icon: '🎸', color: '#E91E63', order: 2 },
    { name: 'Jazz', slug: 'jazz', icon: '🎷', color: '#9C27B0', order: 3 },
    { name: 'Blues', slug: 'blues', icon: '🎺', color: '#3F51B5', order: 4 },
    { name: 'Samba', slug: 'samba', icon: '🥁', color: '#4CAF50', order: 5 },
    { name: 'Bossa Nova', slug: 'bossa-nova', icon: '🎹', color: '#00BCD4', order: 6 },
    { name: 'Soul', slug: 'soul', icon: '💿', color: '#FF5722', order: 7 },
    { name: 'Funk', slug: 'funk', icon: '🎤', color: '#795548', order: 8 },
    { name: 'Clássica', slug: 'classica', icon: '🎻', color: '#607D8B', order: 9 },
    { name: 'Eletrônica', slug: 'eletronica', icon: '🎧', color: '#00E676', order: 10 },
    { name: 'Hip Hop', slug: 'hip-hop', icon: '🎤', color: '#FFC107', order: 11 },
    { name: 'Reggae', slug: 'reggae', icon: '🌴', color: '#8BC34A', order: 12 },
    { name: 'Pop', slug: 'pop', icon: '⭐', color: '#E91E63', order: 13 },
    { name: 'Internacional', slug: 'internacional', icon: '🌎', color: '#2196F3', order: 14 },
    { name: 'Outros', slug: 'outros', icon: '🎶', color: '#9E9E9E', order: 99 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('✅ Categorias criadas com sucesso!');
  console.log(`📊 Total: ${categories.length} categorias`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao fazer seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

