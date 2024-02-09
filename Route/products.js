const express = require('express');
const router = express.Router();
const { getProducts, getOneProduct, createProduct, deleteProduct, updateProduct } = require('../Controllers/productCtrl')
const requireAuth = require('../Middleware/authMiddleware')
const requireAdmin = require('../Middleware/adminMiddleware')




//GET all products
router.get('/', getProducts)

//GET one product
router.get('/:id', getOneProduct)

//POST product
router.post('/', [requireAuth, requireAdmin], createProduct)

//DELETE one product
router.delete('/:id', [requireAuth, requireAdmin], deleteProduct)

//UPDATE one product
router.put('/:id', [requireAuth, requireAdmin], updateProduct)





module.exports = router;