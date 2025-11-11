const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

// Ver coleção pública via token do QR Code
router.get('/collection/:token', publicController.getPublicCollection);

// Ver disco específico da coleção pública
router.get('/collection/:token/vinyl/:vinylId', publicController.getPublicVinyl);

module.exports = router;

