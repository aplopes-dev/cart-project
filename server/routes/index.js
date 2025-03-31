const express = require('express');
const router = express.Router();

// Importa as rotas
const productsRouter = require('./products');

// Registra as rotas
router.use('/products', productsRouter);

module.exports = router;
