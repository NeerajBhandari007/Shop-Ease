//  kisi endpoint me ya route me attach kar rahe hai hum sidhe function server me atach karne ke bajae
const express = require('express');
const { createProduct, fetchAllProducts, fetchProductById, updateProduct, searchProducts } = require('../controller/Product');

const router = express.Router();
//  products is already added in base path
router.post('/', createProduct)
      .post('/search/',searchProducts)
      .get('/', fetchAllProducts)
      .get('/:id', fetchProductById)
      .patch('/:id', updateProduct)

exports.router = router;