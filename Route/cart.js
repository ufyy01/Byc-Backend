const express = require('express');
const router = express.Router();
const { getCart, postCart, deleteProduct } = require('../Controllers/cartCtrl')
const requireAuth = require('../Middleware/authMiddleware')
const requireAdmin = require('../Middleware/adminMiddleware')


//get cart
router.get('/:id', getCart)


//POST cart
router.post('/', postCart)

//DELETE product
router.delete('/:cartId/products/:productId', deleteProduct)



module.exports = router;