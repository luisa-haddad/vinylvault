const prisma = require('../config/database');

class PublicController {
  // Ver coleção pública de um usuário via QR Code token
  async getPublicCollection(req, res) {
    try {
      const { token } = req.params;
      const { categoryId, search } = req.query;

      // Buscar usuário pelo token
      const user = await prisma.user.findUnique({
        where: { qrCodeToken: token },
        select: {
          id: true,
          name: true,
          avatar: true,
          isPublic: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Coleção não encontrada'
        });
      }

      if (!user.isPublic) {
        return res.status(403).json({
          success: false,
          message: 'Esta coleção é privada'
        });
      }

      // Buscar discos do usuário
      const where = {
        userId: user.id,
        ...(categoryId && { categoryId }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { artist: { contains: search, mode: 'insensitive' } }
          ]
        })
      };

      const vinyls = await prisma.vinyl.findMany({
        where,
        include: {
          category: true,
          tracks: {
            orderBy: { position: 'asc' }
          }
        },
        orderBy: [
          { category: { order: 'asc' } },
          { artist: 'asc' },
          { title: 'asc' }
        ]
      });

      // Estatísticas básicas
      const stats = {
        total: vinyls.length,
        byCategory: {}
      };

      vinyls.forEach(vinyl => {
        const categoryName = vinyl.category.name;
        stats.byCategory[categoryName] = (stats.byCategory[categoryName] || 0) + 1;
      });

      res.json({
        success: true,
        data: {
          owner: {
            name: user.name,
            avatar: user.avatar
          },
          vinyls,
          stats
        }
      });
    } catch (error) {
      console.error('Erro ao buscar coleção pública:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar coleção'
      });
    }
  }

  // Ver detalhes de um disco específico na coleção pública
  async getPublicVinyl(req, res) {
    try {
      const { token, vinylId } = req.params;

      // Buscar usuário pelo token
      const user = await prisma.user.findUnique({
        where: { qrCodeToken: token },
        select: {
          id: true,
          isPublic: true
        }
      });

      if (!user || !user.isPublic) {
        return res.status(404).json({
          success: false,
          message: 'Disco não encontrado'
        });
      }

      // Buscar disco
      const vinyl = await prisma.vinyl.findFirst({
        where: {
          id: vinylId,
          userId: user.id
        },
        include: {
          category: true,
          tracks: {
            orderBy: { position: 'asc' }
          }
        }
      });

      if (!vinyl) {
        return res.status(404).json({
          success: false,
          message: 'Disco não encontrado'
        });
      }

      res.json({
        success: true,
        data: vinyl
      });
    } catch (error) {
      console.error('Erro ao buscar disco público:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar disco'
      });
    }
  }
}

module.exports = new PublicController();

