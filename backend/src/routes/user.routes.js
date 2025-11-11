const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Perfil
router.put('/profile', validate(schemas.updateUser), userController.updateProfile);

// QR Code
router.get('/qrcode', userController.generateQRCode);
router.post('/qrcode/regenerate', userController.regenerateQRToken);

module.exports = router;

