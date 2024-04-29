const express = require('express');
const router = express.Router();
const { getCart, postCart, deleteCartProduct, moveToWish, updateCart } = require('../Controllers/cartCtrl')


//get cart
router.get('/', getCart)


//POST cart
router.post('/', postCart)

//updateCart
router.put('/', updateCart)

//move to wishlist
router.post('/to-wishlist/:productId', moveToWish)

//DELETE product
router.delete('/:productId', deleteCartProduct)



module.exports = router; 