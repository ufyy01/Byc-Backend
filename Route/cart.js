const express = require('express');
const router = express.Router();
const { getCart, postCart, deleteCartProduct } = require('../Controllers/cartCtrl')
// const requireAdmin = require('../Middleware/adminMiddleware')


//get cart
router.get('/:id', getCart)


//POST cart
router.post('/', postCart)

//DELETE product
router.delete('/:id/:productId', deleteCartProduct)



module.exports = router; 