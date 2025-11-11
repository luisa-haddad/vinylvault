const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// Listar categorias (público)
router.get('/', categoryController.list);
router.get('/:id', categoryController.getById);

module.exports = router;

