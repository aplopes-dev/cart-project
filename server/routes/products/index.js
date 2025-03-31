const express = require('express');
const router = express.Router();

// Importa as rotas
const maxPriceRouter = require('./max-price');

// Registra as rotas
router.use('/max-price', maxPriceRouter);

module.exports = router;
