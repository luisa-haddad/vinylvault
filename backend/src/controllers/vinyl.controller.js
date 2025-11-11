const prisma = require('../config/database');
const discogsService = require('../services/discogs.service');
// Usando apenas Discogs por enquanto

class VinylController {
  // Listar discos do usuário
  async list(req, res) {
    try {
      const { categoryId, search } = req.query;
      const userId = req.user.id;

      const where = {
        userId,
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

      res.json({
        success: true,
        data: vinyls
      });
    } catch (error) {
      console.error('Erro ao listar discos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao listar discos'
      });
    }
  }

  // Buscar disco por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const vinyl = await prisma.vinyl.findFirst({
        where: {
          id,
          userId
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
      console.error('Erro ao buscar disco:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar disco'
      });
    }
  }

  // Criar novo disco
  async create(req, res) {
    try {
      const userId = req.user.id;
      const { tracks, ...vinylData } = req.body;

      const vinyl = await prisma.vinyl.create({
        data: {
          ...vinylData,
          userId,
          ...(tracks && tracks.length > 0 && {
            tracks: {
              create: tracks
            }
          })
        },
        include: {
          category: true,
          tracks: {
            orderBy: { position: 'asc' }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Disco adicionado com sucesso',
        data: vinyl
      });
    } catch (error) {
      console.error('Erro ao criar disco:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar disco'
      });
    }
  }

  // Atualizar disco
  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      // Verificar se o disco pertence ao usuário
      const existingVinyl = await prisma.vinyl.findFirst({
        where: { id, userId }
      });

      if (!existingVinyl) {
        return res.status(404).json({
          success: false,
          message: 'Disco não encontrado'
        });
      }

      const vinyl = await prisma.vinyl.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
          tracks: {
            orderBy: { position: 'asc' }
          }
        }
      });

      res.json({
        success: true,
        message: 'Disco atualizado com sucesso',
        data: vinyl
      });
    } catch (error) {
      console.error('Erro ao atualizar disco:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar disco'
      });
    }
  }

  // Deletar disco
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Verificar se o disco pertence ao usuário
      const existingVinyl = await prisma.vinyl.findFirst({
        where: { id, userId }
      });

      if (!existingVinyl) {
        return res.status(404).json({
          success: false,
          message: 'Disco não encontrado'
        });
      }

      await prisma.vinyl.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Disco removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar disco:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar disco'
      });
    }
  }

  // Buscar disco por barcode nas APIs externas
  async searchByBarcode(req, res) {
    try {
      const { barcode } = req.params;
      const { page = 1, per_page = 20 } = req.query;
      
      console.log('📲 [Controller] Requisição de busca por barcode:', barcode, '| Página:', page);

      // Buscar no Discogs
      const data = await discogsService.searchByBarcode(barcode, parseInt(page), parseInt(per_page));

      console.log('📤 [Controller] Retornando', data.results.length, 'resultados');
      
      res.json({
        success: true,
        data: {
          source: 'discogs',
          results: data.results,
          pagination: data.pagination
        }
      });
    } catch (error) {
      console.error('❌ [Controller] Erro ao buscar por barcode:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar disco'
      });
    }
  }

  // Buscar disco por nome nas APIs externas
  async search(req, res) {
    try {
      const { query, type = 'release', page = 1, per_page = 20 } = req.query;
      console.log('📲 [Controller] Requisição de busca por nome:', query, 'tipo:', type, '| Página:', page);

      if (!query) {
        console.log('❌ [Controller] Query vazia!');
        return res.status(400).json({
          success: false,
          message: 'Query de busca é obrigatória'
        });
      }

      // Buscar apenas no Discogs
      const data = await discogsService.search(query, type, parseInt(page), parseInt(per_page));

      console.log('📤 [Controller] Retornando', data.results.length, 'resultados');
      
      res.json({
        success: true,
        data: data.results,
        pagination: data.pagination
      });
    } catch (error) {
      console.error('❌ [Controller] Erro ao buscar disco:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar disco'
      });
    }
  }

  // Obter detalhes de um disco do Discogs
  async getDiscogsDetails(req, res) {
    try {
      const { id } = req.params;

      const details = await discogsService.getRelease(id);

      res.json({
        success: true,
        data: details
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar detalhes do disco'
      });
    }
  }

  // Estatísticas da coleção
  async stats(req, res) {
    try {
      const userId = req.user.id;

      const [total, byCategory, totalValue] = await Promise.all([
        // Total de discos
        prisma.vinyl.count({
          where: { userId }
        }),

        // Por categoria
        prisma.vinyl.groupBy({
          by: ['categoryId'],
          where: { userId },
          _count: true
        }),

        // Valor total (se informado)
        prisma.vinyl.aggregate({
          where: { userId },
          _sum: {
            purchasePrice: true
          }
        })
      ]);

      // Buscar nomes das categorias
      const categoriesWithCount = await Promise.all(
        byCategory.map(async (item) => {
          const category = await prisma.category.findUnique({
            where: { id: item.categoryId }
          });
          return {
            category: category,
            count: item._count
          };
        })
      );

      res.json({
        success: true,
        data: {
          total,
          totalValue: totalValue._sum.purchasePrice || 0,
          byCategory: categoriesWithCount
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar estatísticas'
      });
    }
  }
}

module.exports = new VinylController();

