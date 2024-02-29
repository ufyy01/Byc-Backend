const express = require('express');
const router = express.Router();
const { getCart, postCart, deleteCartProduct, moveToWish } = require('../Controllers/cartCtrl')
const requireAuth = require('../Middleware/authMiddleware')


//get cart
router.get('/', requireAuth, getCart)


//POST cart
router.post('/', requireAuth, postCart)

router.post('/to-wishlist/:productId', requireAuth, moveToWish)

//DELETE product
router.delete('/:id/:productId', requireAuth, deleteCartProduct)



module.exports = router; 