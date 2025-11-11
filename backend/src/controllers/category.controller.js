const prisma = require('../config/database');

class CategoryController {
  // Listar todas as categorias
  async list(req, res) {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { order: 'asc' }
      });

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao listar categorias'
      });
    }
  }

  // Buscar categoria por ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const category = await prisma.category.findUnique({
        where: { id }
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar categoria'
      });
    }
  }
}

module.exports = new CategoryController();

