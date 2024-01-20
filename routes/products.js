const express = require('express');
const router = express.Router();
const { getProducts, getOneProduct, createProduct, deleteProduct, updateProduct } = require('../Controllers/productCtrl')



//GET all products
router.get('/', getProducts)

//GET one product
router.get('/:id', getOneProduct)

//POST product
router.post('/', createProduct)

//DELETE one product
router.delete('/:id', deleteProduct)

//UPDATE one product
router.put('/:id', updateProduct)





module.exports = router;