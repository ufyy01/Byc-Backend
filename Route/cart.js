const express = require('express');
const router = express.Router();
const { getCart, postCart, deleteCartProduct, moveToWish } = require('../Controllers/cartCtrl')
// const requireAdmin = require('../Middleware/adminMiddleware')


//get cart
router.get('/:userId', getCart)


//POST cart
router.post('/', postCart)

router.post('/to-wishlist/:productId', moveToWish)

//DELETE product
router.delete('/:id/:productId', deleteCartProduct)



module.exports = router; 