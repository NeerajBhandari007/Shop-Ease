//  kisi endpoint me ya route me attach kar rahe hai hum sidhe function server me atach karne ke bajae
const express = require('express');
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require('../controller/Product');

const router = express.Router();
//  products is already added in base path
router.post('/', createProduct)
      .get('/', fetchAllProducts)
      .get('/:id', fetchProductById)
      .patch('/:id', updateProduct)

exports.router = router;