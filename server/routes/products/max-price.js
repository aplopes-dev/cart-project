const express = require('express');
const router = express.Router();
const db = require('../../db');

/**
 * @swagger
 * /products/max-price:
 *   get:
 *     summary: Obtém o preço máximo dos produtos
 *     description: Retorna o preço máximo dos produtos, opcionalmente filtrado por categoria e/ou marcas
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: ID da categoria para filtrar os produtos
 *       - in: query
 *         name: brands
 *         schema:
 *           type: string
 *         description: Lista de IDs de marcas separados por vírgula para filtrar os produtos
 *     responses:
 *       200:
 *         description: Preço máximo dos produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 maxPrice:
 *                   type: number
 *                   description: Preço máximo dos produtos
 *       500:
 *         description: Erro do servidor
 */
router.get('/', async (req, res) => {
  try {
    const { categoryId, brands } = req.query;
    
    // Constrói a consulta SQL base
    let query = 'SELECT MAX(price) as maxPrice FROM products WHERE 1=1';
    const params = [];
    
    // Adiciona filtro de categoria se fornecido
    if (categoryId) {
      query += ' AND category_id = ?';
      params.push(categoryId);
    }
    
    // Adiciona filtro de marcas se fornecido
    if (brands) {
      const brandIds = brands.split(',').map(id => parseInt(id, 10));
      if (brandIds.length > 0) {
        query += ` AND brand_id IN (${brandIds.map(() => '?').join(',')})`;
        params.push(...brandIds);
      }
    }
    
    // Executa a consulta
    const [results] = await db.query(query, params);
    
    // Retorna o preço máximo ou 0 se não houver produtos
    const maxPrice = results[0]?.maxPrice || 0;
    
    res.json({ maxPrice });
  } catch (error) {
    console.error('Error fetching max price:', error);
    res.status(500).json({ error: 'Error fetching max price' });
  }
});

module.exports = router;
