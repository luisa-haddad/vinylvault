const prisma = require('../config/database');
const QRCode = require('qrcode');

class UserController {
  // Atualizar perfil
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, avatar, isPublic } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(avatar !== undefined && { avatar }),
          ...(isPublic !== undefined && { isPublic })
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          qrCodeToken: true,
          isPublic: true,
          updatedAt: true
        }
      });

      res.json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: user
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar perfil'
      });
    }
  }

  // Gerar QR Code para compartilhamento
  async generateQRCode(req, res) {
    try {
      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { qrCodeToken: true }
      });

      // URL pública da coleção
      const publicUrl = `${process.env.FRONTEND_BASE_URL}/public/${user.qrCodeToken}`;

      // Gerar QR Code
      const qrCodeDataURL = await QRCode.toDataURL(publicUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      res.json({
        success: true,
        data: {
          qrCode: qrCodeDataURL,
          publicUrl,
          token: user.qrCodeToken
        }
      });
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao gerar QR Code'
      });
    }
  }

  // Regenerar token do QR Code
  async regenerateQRToken(req, res) {
    try {
      const userId = req.user.id;
      const { v4: uuidv4 } = require('uuid');

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          qrCodeToken: uuidv4()
        },
        select: {
          qrCodeToken: true
        }
      });

      res.json({
        success: true,
        message: 'Token regenerado com sucesso',
        data: {
          qrCodeToken: user.qrCodeToken
        }
      });
    } catch (error) {
      console.error('Erro ao regenerar token:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao regenerar token'
      });
    }
  }
}

module.exports = new UserController();

