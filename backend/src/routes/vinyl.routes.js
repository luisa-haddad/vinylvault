const express = require('express');
const router = express.Router();
const vinylController = require('../controllers/vinyl.controller');
const authMiddleware = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validator');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Buscar nas APIs externas
router.get('/search', vinylController.search);
router.get('/search/barcode/:barcode', vinylController.searchByBarcode);
router.get('/discogs/:id', vinylController.getDiscogsDetails);

// CRUD de discos
router.get('/', vinylController.list);
router.get('/stats', vinylController.stats);
router.get('/:id', vinylController.getById);
router.post('/', validate(schemas.createVinyl), vinylController.create);
router.put('/:id', validate(schemas.updateVinyl), vinylController.update);
router.delete('/:id', vinylController.delete);

module.exports = router;

