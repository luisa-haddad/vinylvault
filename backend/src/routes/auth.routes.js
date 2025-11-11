const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');

// Registro
router.post('/register', validate(schemas.register), authController.register);

// Login
router.post('/login', validate(schemas.login), authController.login);

// Perfil (requer autenticação)
router.get('/me', authMiddleware, authController.me);

module.exports = router;

